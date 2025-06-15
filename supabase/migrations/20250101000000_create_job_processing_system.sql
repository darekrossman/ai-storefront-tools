-- Job Processing System Migration
-- Implements Priority Queue with Database Triggers architecture

-- Create job_queue table for background job processing
CREATE TABLE job_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN ('product_generation', 'image_generation', 'catalog_export', 'batch_processing')),
  priority INTEGER NOT NULL DEFAULT 5 CHECK (priority BETWEEN 1 AND 10), -- 1 = highest priority
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  
  -- Job data
  input_data JSONB NOT NULL,
  output_data JSONB,
  error_data JSONB,
  
  -- Progress tracking
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  progress_message TEXT,
  
  -- Metadata
  catalog_id TEXT REFERENCES product_catalogs(catalog_id) ON DELETE CASCADE,
  estimated_duration_seconds INTEGER,
  actual_duration_seconds INTEGER,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient job processing
CREATE INDEX idx_job_queue_status_priority ON job_queue(status, priority, created_at);
CREATE INDEX idx_job_queue_user_id ON job_queue(user_id);
CREATE INDEX idx_job_queue_catalog_id ON job_queue(catalog_id);
CREATE INDEX idx_job_queue_type ON job_queue(job_type);

-- Create job_progress table for detailed progress tracking
CREATE TABLE job_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES job_queue(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'skipped')),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  message TEXT,
  data JSONB,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_progress_job_id ON job_progress(job_id, step_order);

-- Create function to update job progress
CREATE OR REPLACE FUNCTION update_job_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the main job's progress based on completed steps
  UPDATE job_queue 
  SET 
    progress_percent = (
      SELECT COALESCE(AVG(progress_percent), 0)::INTEGER
      FROM job_progress 
      WHERE job_id = NEW.job_id
    ),
    progress_message = NEW.message,
    updated_at = NOW()
  WHERE id = NEW.job_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update job progress
CREATE TRIGGER trigger_update_job_progress
  AFTER INSERT OR UPDATE ON job_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_job_progress();

-- Create function to get next job from priority queue
CREATE OR REPLACE FUNCTION get_next_job()
RETURNS TABLE(
  job_id UUID,
  job_type TEXT,
  input_data JSONB,
  user_id UUID,
  catalog_id TEXT
) AS $$
DECLARE
  selected_job RECORD;
BEGIN
  -- Select and lock the highest priority pending job
  SELECT INTO selected_job *
  FROM job_queue
  WHERE status = 'pending'
  ORDER BY priority ASC, created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;
  
  IF selected_job IS NULL THEN
    RETURN;
  END IF;
  
  -- Mark job as processing
  UPDATE job_queue
  SET 
    status = 'processing',
    started_at = NOW(),
    updated_at = NOW()
  WHERE id = selected_job.id;
  
  -- Return job details
  RETURN QUERY SELECT 
    selected_job.id,
    selected_job.job_type,
    selected_job.input_data,
    selected_job.user_id,
    selected_job.catalog_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to complete a job
CREATE OR REPLACE FUNCTION complete_job(
  p_job_id UUID,
  p_status TEXT,
  p_output_data JSONB DEFAULT NULL,
  p_error_data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE job_queue
  SET 
    status = p_status,
    output_data = COALESCE(p_output_data, output_data),
    error_data = COALESCE(p_error_data, error_data),
    completed_at = NOW(),
    updated_at = NOW(),
    actual_duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at))::INTEGER,
    progress_percent = CASE WHEN p_status = 'completed' THEN 100 ELSE progress_percent END
  WHERE id = p_job_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to add job progress step
CREATE OR REPLACE FUNCTION add_job_progress_step(
  p_job_id UUID,
  p_step_name TEXT,
  p_step_order INTEGER,
  p_status TEXT DEFAULT 'pending',
  p_progress_percent INTEGER DEFAULT 0,
  p_message TEXT DEFAULT NULL,
  p_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  step_id UUID;
BEGIN
  INSERT INTO job_progress (
    job_id, step_name, step_order, status, progress_percent, message, data
  ) VALUES (
    p_job_id, p_step_name, p_step_order, p_status, p_progress_percent, p_message, p_data
  ) RETURNING id INTO step_id;
  
  RETURN step_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to update job progress step
CREATE OR REPLACE FUNCTION update_job_progress_step(
  p_step_id UUID,
  p_status TEXT,
  p_progress_percent INTEGER DEFAULT NULL,
  p_message TEXT DEFAULT NULL,
  p_data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE job_progress
  SET 
    status = p_status,
    progress_percent = COALESCE(p_progress_percent, progress_percent),
    message = COALESCE(p_message, message),
    data = COALESCE(p_data, data),
    started_at = CASE WHEN p_status = 'processing' AND started_at IS NULL THEN NOW() ELSE started_at END,
    completed_at = CASE WHEN p_status IN ('completed', 'failed', 'skipped') THEN NOW() ELSE completed_at END
  WHERE id = p_step_id;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on job_queue table
ALTER TABLE job_queue ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can only see their own jobs
CREATE POLICY "Users can view their own jobs" ON job_queue
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own jobs" ON job_queue
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs" ON job_queue
  FOR UPDATE USING (auth.uid() = user_id);

-- Enable RLS on job_progress table
ALTER TABLE job_progress ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can only see progress for their own jobs
CREATE POLICY "Users can view progress for their own jobs" ON job_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM job_queue 
      WHERE job_queue.id = job_progress.job_id 
      AND job_queue.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert progress for their own jobs" ON job_progress
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM job_queue 
      WHERE job_queue.id = job_progress.job_id 
      AND job_queue.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update progress for their own jobs" ON job_progress
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM job_queue 
      WHERE job_queue.id = job_progress.job_id 
      AND job_queue.user_id = auth.uid()
    )
  );

-- Create notification function for real-time updates
CREATE OR REPLACE FUNCTION notify_job_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Send notification for job status changes
  PERFORM pg_notify(
    'job_update',
    json_build_object(
      'job_id', NEW.id,
      'user_id', NEW.user_id,
      'status', NEW.status,
      'progress_percent', NEW.progress_percent,
      'progress_message', NEW.progress_message
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for real-time job notifications
CREATE TRIGGER trigger_notify_job_update
  AFTER UPDATE ON job_queue
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status OR OLD.progress_percent IS DISTINCT FROM NEW.progress_percent)
  EXECUTE FUNCTION notify_job_update();

-- Add helpful comments
COMMENT ON TABLE job_queue IS 'Background job processing queue with priority support';
COMMENT ON TABLE job_progress IS 'Detailed progress tracking for jobs with individual steps';
COMMENT ON FUNCTION get_next_job() IS 'Atomically gets the next highest priority job and marks it as processing';
COMMENT ON FUNCTION complete_job(UUID, TEXT, JSONB, JSONB) IS 'Marks a job as completed or failed with output/error data'; 