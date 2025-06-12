import OpenAI, { toFile } from 'openai'
import { fal } from '@fal-ai/client'

export async function POST(request: Request) {
  const {
    prompt,
    promptOverride,
    image_url,
  }: { prompt: any; promptOverride?: string; image_url?: string } = await request.json()

  const fullPrompt =
    promptOverride ||
    `${prompt.imageDirection}. 

## Photo Guidelines
- The product must fit entirely in the frame and not be cropped or exceed the bounds of the photograph.
- The product should comfortably fit in the frame.
- No cropping.
- No text in the background unless instructed.
- Ecommerce product photography. Studio lighting, sharp focus, high detail.
`

  const result = await generateWithOpenAI(fullPrompt, image_url)
  // const result = await generateWithFal(fullPrompt, image_url)

  return Response.json(result)
}

async function generateWithOpenAI(prompt: string, image_url?: string) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const input = [
    {
      role: 'user',
      content: [
        {
          type: 'input_text',
          text: `${prompt}\n\n## Product Information\n${JSON.stringify(prompt)}`,
        },
      ],
    },
  ] as any

  if (image_url) {
    input[0]?.content?.push({ type: 'input_image', image_url })
  }

  console.log(prompt)

  const result = await client.responses.create({
    model: 'gpt-4.1',
    input,
    tool_choice: {
      type: 'image_generation',
    },
    tools: [
      {
        type: 'image_generation',
        model: 'gpt-image-1',
        background: 'transparent',
        output_format: 'webp',
        quality: 'medium',
        // size: '1024x1024',
        moderation: 'low',
      },
    ],
  })

  // const isEdit = image_url != null

  // const result = await client.images[isEdit ? 'edit' : 'generate']({
  //   model: 'gpt-image-1',
  //   background: 'transparent',
  //   output_format: 'webp',
  //   quality: 'medium',
  //   size: '1024x1024',
  //   moderation: 'low',
  //   prompt,
  //   image: image_url ? [image_url] : undefined,
  // })

  // result.data?.forEach((item) => {
  //   item.b64_json = `data:image/webp;base64,${item.b64_json}`
  // })

  return result
}

async function generateWithFal(prompt: string, image_url?: string) {
  const genModel = 'fal-ai/flux-pro/kontext/max/text-to-image'
  const editModel = 'fal-ai/flux-pro/kontext/max'
  const model = image_url ? editModel : genModel

  console.log(prompt, model)

  const result = await fal.subscribe(model, {
    input: {
      prompt,
      negative_prompt: '',
      image_size: {
        height: 1024,
        width: 1024,
      },
      aspect_ratio: '1:1',
      num_inference_steps: 50,
      guidance_scale: 7.5,
      num_images: 1,
      enable_safety_checker: false,
      output_format: 'png',
      sync_mode: true,
      image_url,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === 'IN_PROGRESS') {
        update.logs.map((log) => log.message).forEach(console.log)
      }
    },
  })

  return {
    data: [
      {
        b64_json: result.data.images[0].url,
      },
    ],
  }
}
