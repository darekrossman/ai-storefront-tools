import { openai } from '@ai-sdk/openai'
import { createDataStreamResponse, generateObject, streamObject } from 'ai'
import {
  createBaseProductSchema,
  createFullProductSchema,
  enhancedProductFieldsSchema,
} from '@/lib/products/schemas'
import { getContextForCatalog } from '@/actions/generation/context-utils'
import { baseProductGen, fullProductGen } from '@/lib/products/prompts'

export async function POST(req: Request) {
  const body = await req.json()
  const { catalogId, categoryIds, count } = body

  console.log('catalogId', catalogId)
  console.log('categoryIds', categoryIds)
  console.log('Building brand context...')

  const contextData = await getContextForCatalog(catalogId)
  const totalExpectedProducts = count * categoryIds.length

  console.log('Generating products...')

  const baseContent = `## PRODUCT GENERATION REQUEST\n\n### EXACT REQUIREMENTS:\n${categoryIds.map((id: string) => `- Subcategory ID: ${id} → Generate EXACTLY ${count} products`).join('\n')}\n\n### TOTAL EXPECTED OUTPUT: ${totalExpectedProducts} products\n\n### VERIFICATION CHECKLIST:\n${categoryIds.map((id: string) => `□ ${count} products assigned to ${id}`).join('\n')}\n□ Total: ${totalExpectedProducts} products\n\n## Catalog Data\n${JSON.stringify(contextData)}`

  // ------------------------------------------------------------
  // ------------------------------------------------------------

  const enhancementContent = (baseProduct: any) =>
    `## PRODUCT ENHANCEMENT REQUEST\n\nEnhance the following product:\n${JSON.stringify(baseProduct)}\n\n## Catalog Data\n${JSON.stringify(contextData)}`

  // ------------------------------------------------------------
  // ------------------------------------------------------------

  const baseSchema = createBaseProductSchema(count, categoryIds)

  const baseResult = await generateObject({
    model: openai('gpt-4.1'),
    schema: baseSchema,
    system: baseProductGen,
    maxTokens: 32768,
    temperature: 0.3,
    messages: [{ role: 'user', content: baseContent }],
  })

  const baseProducts = Object.values(baseResult.object)
    .map((val) => val.products)
    .flat()

  console.log('finished base products')

  const enhancedProducts = baseProducts.map((product) => {
    console.log('enhancing product', product.name)
    return generateObject({
      model: openai('gpt-4.1'),
      schema: enhancedProductFieldsSchema,
      system: fullProductGen,
      maxTokens: 32768,
      temperature: 0.3,
      messages: [{ role: 'user', content: enhancementContent(product) }],
    }).then((result) => {
      return {
        ...product,
        ...result.object,
      }
    })
  })

  const fullProducts = await Promise.all(enhancedProducts)

  // Restructure fullProducts back to the original schema format
  const byCategory: Record<string, { products: any[] }> = {}

  for (const product of fullProducts) {
    const categoryId = product.parent_category_id
    if (!byCategory[categoryId]) {
      byCategory[categoryId] = { products: [] }
    }
    byCategory[categoryId].products.push(product)
  }

  return new Response(JSON.stringify(byCategory))

  // const result = streamObject({
  //   model: openai('gpt-4.1'),
  //   schema,
  //   system: fullProductGen,
  //   maxTokens: 32768,
  //   temperature: 0.3,
  //   messages: [
  //     {
  //       role: 'user',
  //       content: enhancementContent(baseResult.object),
  //     },
  //   ],
  //   onError: (error) => {
  //     console.error(error)
  //   },
  //   onFinish: (result) => {
  //     console.log(`Usage: ${JSON.stringify(result.usage, null, 2)}`)
  //     console.log(`Warnings: ${JSON.stringify(result.warnings, null, 2)}`)
  //   },
  // })

  // return result.toTextStreamResponse()
}
