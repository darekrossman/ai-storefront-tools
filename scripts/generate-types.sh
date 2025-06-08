#!/bin/bash

# Generate Supabase types script
# This script regenerates TypeScript types from the Supabase database schema

echo "🔄 Generating Supabase types..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Generate types from local database
echo "📡 Connecting to local Supabase database..."
supabase gen types --lang=typescript --local > lib/supabase/types.ts

if [ $? -eq 0 ]; then
    echo "✅ Types generated successfully!"
    echo "📁 Generated file: lib/supabase/types.ts"
    echo ""
    echo "💡 The generated types are automatically used in:"
    echo "   - lib/supabase/database-types.ts (convenience exports)"
    echo "   - lib/supabase/server.ts (typed client)"
    echo "   - lib/supabase/session.ts (typed client)"
    echo "   - app/actions/*.ts (server actions)"
else
    echo "❌ Failed to generate types"
    exit 1
fi

echo ""
echo "🎉 Type generation complete!" 