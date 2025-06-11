import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1).max(255).describe('The name of the product'),
  description: z.string().min(1).max(1000).describe('The description of the product'),
  parent_category_id: z.string().describe('The parent category_id of the product'),
  short_description: z
    .string()
    .min(1)
    .max(155)
    .describe('The short description of the product'),
  specifications: z
    .record(z.string(), z.string())
    .describe('The specifications of the product that do not vary by variant'),
  base_attributes: z
    .record(z.string(), z.string())
    .describe('Default attribute values that all variants inherit (can be overridden)'),
  tags: z.array(z.string()).min(1).max(5).describe('The tags of the product'),
  meta_title: z.string().min(1).max(70).describe('The SEO meta title of the product'),
  meta_description: z
    .string()
    .min(1)
    .max(155)
    .describe('The SEO meta description of the product'),
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
  options: z
    .array(z.record(z.string(), z.string()))
    .describe(
      'The options of the attribute. For select type, Available options for select types like [{"value": "red", "label": "Red"}]. For other types, this is an empty array.',
    ),
  default_value: z.string().describe('The default value of the attribute'),
  is_required: z
    .boolean()
    .describe('Whether this attribute is required for all variants'),
})

export const productVariantSchema = z.object({
  price: z.number().min(0).describe('Selling price for this variant'),
  attributes: z
    .record(z.string(), z.string())
    .describe(
      'Validated attributes like {"color": "red", "size": "large"}. These should match the attribute_key and attribute_type of the product attribute schema.',
    ),
})

export const fullProductSchema = productSchema.extend({
  attributes: z.array(productAttributeSchema).min(0).max(3),
  variants: z
    .array(productVariantSchema)
    .min(1)
    .describe('Variants for each product attribute combination'),
})
