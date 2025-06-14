import OpenAI, { toFile } from 'openai'
import { fal } from '@fal-ai/client'

export async function POST(request: Request) {
  const {
    prompt,
    promptOverride,
    image_url,
  }: { prompt: any; promptOverride?: string; image_url?: string } = await request.json()

  const { imageDirection, ...productInfo } = prompt

  //   const fullPrompt =
  //     promptOverride ||
  //     `${imageDirection}.

  // ## Product Information
  // ${JSON.stringify(productInfo)}

  // ## Photo Guidelines
  // - Photo must adhere to product information.
  // - The product must fit entirely in the frame and not be cropped or exceed the bounds of the photograph.
  // - The product should comfortably fit in the frame.
  // - No cropping.
  // - No text in the background unless instructed.
  // - Ecommerce product photography. Studio lighting, sharp focus, high detail.
  // `

  // const result = await generateWithOpenAI(fullPrompt, image_url)

  const imagePrompt = await generatePromptFromProductInfo(productInfo)

  console.log(imagePrompt.output_text)

  const result = await generateWithFal(imagePrompt.output_text, image_url)

  return Response.json(result)
}

async function generatePromptFromProductInfo(productInfo: any) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const result = await client.responses.create({
    model: 'gpt-4.1',
    temperature: 0.8,
    max_output_tokens: 2048,
    input: [
      {
        role: 'system',
        content: [
          {
            type: 'input_text',
            text: 'You are an expert prompt generator that specializes in creating extremely detailed prompts for ecommerce image generation given product information. \n\n## Photo Guidelines\n- Photo must adhere to product information\n- Product should be perfectly centered in the frame\n- The product must fit entirely in the frame\n- No cropping\n- No text in the background unless instructed\n- Ecommerce product photography. Studio lighting, sharp focus, high detail.\n- The product should be displayed against a pure white/transparent background.',
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: `## Product Information\n${JSON.stringify(productInfo)}`,
          },
        ],
      },
    ],
  })

  return result
}

// async function generateWithOpenAI(prompt: string, image_url?: string) {
//   const client = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//   })

//   const input = [
//     {
//       role: 'user',
//       content: [
//         {
//           type: 'input_text',
//           text: prompt,
//         },
//       ],
//     },
//   ] as any

//   if (image_url) {
//     input[0]?.content?.push({ type: 'input_image', image_url })
//   }

//   console.log(prompt)

//   const result = await client.responses.create({
//     model: 'gpt-4.1',
//     input,
//     tool_choice: {
//       type: 'image_generation',
//     },
//     tools: [
//       {
//         type: 'image_generation',
//         model: 'gpt-image-1',
//         background: 'transparent',
//         output_format: 'webp',
//         quality: 'high',
//         size: '1024x1536',
//         moderation: 'low',
//       },
//     ],
//   })

//   return result
// }

async function generateWithFal(prompt: string, image_url?: string) {
  const genModel = 'fal-ai/flux-pro/kontext/max/text-to-image'
  const editModel = 'fal-ai/flux-pro/kontext/max'
  const model = image_url ? editModel : genModel

  const result = await fal.subscribe(model, {
    input: {
      prompt,
      negative_prompt: '',
      image_size: {
        height: 1024,
        width: 1024,
      },
      aspect_ratio: '1:1',
      guidance_scale: 13.5,
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

  return result
}
