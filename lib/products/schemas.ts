import { z } from 'zod'

export const baseProductSchema = z.object({
  name: z.string().min(1).max(255).describe('The name of the product'),
  slug: z
    .string()
    .describe(
      'The slug of the product in url-friendly form, lowercase, hyphenated, no special chars, no spaces, etc',
    ),
  description: z.string().min(1).max(1000).describe('The description of the product'),
  parent_category_id: z.string().describe('The parent category_id of the product'),
  short_description: z
    .string()
    .min(1)
    .max(155)
    .describe('The short description of the product'),
})

export const extendedBaseProductFieldsSchema = z.object({
  specifications: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      }),
    )
    .min(0)
    .describe('The specifications of the product that do not vary by variant'),
  base_attributes: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      }),
    )
    .min(0)
    .describe(
      'Basic attributes of the product like brand, artist, collection, etc. Not related to variation attributes.',
    ),
  tags: z.array(z.string()).min(1).max(5).describe('The tags of the product'),
  meta_title: z
    .string()
    .min(1)
    .max(80)
    .describe(
      'The SEO meta title of the product, typically just the product name, shortened to meet length requirements.',
    ),
  meta_description: z
    .string()
    .min(1)
    .max(175)
    .describe('The SEO meta description of the product'),
})

export const productSchema = baseProductSchema.extend({
  ...extendedBaseProductFieldsSchema.shape,
})

export const productAttributeSchema = z.object({
  attribute_key: z
    .string()
    .min(1)
    .max(255)
    .describe('Attribute identifier like "color", "size", "material", etc.'),
  attribute_label: z
    .string()
    .min(1)
    .max(255)
    .describe('Human-readable label like "Color", "Size", "Material", etc.'),
  attribute_type: z
    .enum(['select', 'text', 'number', 'boolean', 'color', 'url', 'email'])
    .describe('The type of the attribute'),
  attribute_options: z.array(z.string()).min(0).describe('The options of the attribute'),
  default_value: z.string().describe('The default value of the attribute'),
  is_required: z
    .boolean()
    .describe(
      'Whether this attribute is required for all variants. "select" and "boolean" attribute types are always required. If true, all variants must include this attribute.',
    ),
})

export const productVariantSchema = z.object({
  price: z.number().min(0).describe('Selling price for this variant'),
  attributes: z.array(
    z
      .object({
        attribute_key: z.string().describe('The attribute_key'),
        attribute_value: z.string().describe('The value of the attribute option'),
      })
      .describe(
        'These should match the attribute_key and attribute_type of the product attribute schema for each required attribute in the product attribute schema.',
      ),
  ),
})

export const enhancedProductFieldsSchema = extendedBaseProductFieldsSchema.extend({
  variation_attributes: z
    .array(productAttributeSchema)
    .min(0)
    .max(3)
    .describe('The variation attributes of the product'),
  variants: z
    .array(productVariantSchema)
    .min(1)
    .describe('Variants of the product for each attribute option combination'),
})

export const productSchemaWithVariants = productSchema.extend({
  variation_attributes: z
    .array(productAttributeSchema)
    .min(0)
    .max(3)
    .describe('The variation attributes of the product'),
  variants: z
    .array(productVariantSchema)
    .min(1)
    .describe('Variants of the product for each attribute option combination'),
})

export const fullProductSchema = z.record(
  z.string(),
  z.object({
    products: z.array(productSchemaWithVariants).describe('The products of the catalog'),
  }),
)

export const createFullProductSchema = (count: number, categories: string[]) => {
  return z.object({
    ...categories.reduce((acc: any, category) => {
      acc[category] = z.object({
        products: z
          .array(productSchemaWithVariants)
          .min(count)
          .max(count)
          .length(count)
          .describe('The products of the catalog'),
      })
      return acc
    }, {}),
  })
}

export const createBaseProductSchema = (count: number, categories: string[]) => {
  return z.object({
    ...categories.reduce((acc: any, category) => {
      acc[category] = z.object({
        products: z
          .array(baseProductSchema)
          .min(count)
          .max(count)
          .length(count)
          .describe('The products of the catalog'),
      })
      return acc
    }, {}),
  })
}
