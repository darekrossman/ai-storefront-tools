import { z } from 'zod'

export const categoryStructuredOutputSchemas = z.object({
  name: z.string().describe('The name of the category'),
  description: z.string().describe('The description of the category'),
  slug: z.string().describe('The slug of the category in the form of "category-name"'),
})

export const catalogStructuredOutputSchemas = z.object({
  name: z.string().describe('The name of the catalog'),
  description: z.string().describe('The description of the catalog'),
  slug: z.string().describe('The slug of the catalog in the form of "catalog-name"'),

  categories: z
    .array(
      categoryStructuredOutputSchemas.extend({
        subcategories: z
          .array(categoryStructuredOutputSchemas)
          .length(3)
          .describe('The subcategories of the category'),
      }),
    )
    .length(5)
    .describe('The top-level categories of the catalog'),
})
