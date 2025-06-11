import { openai } from '@ai-sdk/openai'
import { streamObject } from 'ai'
import { getBrandAction } from '@/actions/brands'
import { getProductCatalogAction } from '@/actions/product-catalogs'
import { fullProductSchema } from '@/lib/products/schemas'

function createSystemPrompt() {
  return ``
}

export async function POST(req: Request) {
  const body = await req.json()
  const { brandId, catalogId } = body

  const brand = await getBrandAction(brandId)
  const catalog = await getProductCatalogAction(catalogId)

  if (!brand) {
    return Response.json({ error: 'Brand not found' }, { status: 404 })
  }

  const { id, project_id, status, created_at, updated_at, logo_url, ...brandData } = brand

  const systemPrompt = createSystemPrompt()

  const result = streamObject({
    model: openai('gpt-4.1'),
    schema: fullProductSchema,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Here is the brand data: ${JSON.stringify(brandData)}`,
      },
    ],
  })

  return result.toTextStreamResponse()
}
