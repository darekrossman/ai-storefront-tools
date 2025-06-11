import OpenAI from 'openai'
import { fal } from '@fal-ai/client'

export async function POST(request: Request) {
  const { prompt, image_url }: { prompt: string; image_url?: string } =
    await request.json()

  const fullPrompt = `## Product Info
${JSON.stringify(prompt)}

## Instructions
Create a vivid, stunning rendition of the product given the information you are provided. The product is on display in a high-end gallery store.The product is highly sought after and beautiful. It is eye catching while still adhering to the attributes and specifications you are provided. Ecommerce product photography. Studio lighting, sharp focus, high detail, no shadows or reflections, no extraneous markings, no measurements. The product should comfortably fit in the frame. No cropping. No text in the background. 
`

  // const result = await generateWithOpenAI(fullPrompt)
  const result = await generateWithFal(fullPrompt)

  return Response.json(result)
}

async function generateWithOpenAI(prompt: string) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const result = await client.images.generate({
    model: 'gpt-image-1',
    background: 'auto',
    output_format: 'webp',
    quality: 'medium',
    size: '1024x1024',
    moderation: 'low',

    prompt,
  })

  result.data?.forEach((item) => {
    item.b64_json = `data:image/webp;base64,${item.b64_json}`
  })

  return result
}

async function generateWithFal(prompt: string, image_url?: string) {
  const genModel = 'fal-ai/flux-pro/kontext/max/text-to-image'
  const editModel = 'fal-ai/flux-pro/kontext'

  const result = await fal.subscribe(image_url ? editModel : genModel, {
    input: {
      prompt,
      negative_prompt: '',
      image_size: {
        height: 1024,
        width: 1024,
      },
      aspect_ratio: '1:1',
      num_inference_steps: 24,
      guidance_scale: 7,
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
