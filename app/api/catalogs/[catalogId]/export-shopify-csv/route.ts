import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Shopify CSV field mapping
const SHOPIFY_CSV_HEADERS = [
  'Handle',
  'Title',
  'Body (HTML)',
  'Vendor',
  'Product Category',
  'Type',
  'Tags',
  'Published',
  'Option1 Name',
  'Option1 Value',
  'Option2 Name',
  'Option2 Value',
  'Option3 Name',
  'Option3 Value',
  'Variant SKU',
  'Variant Grams',
  'Variant Inventory Tracker',
  'Variant Inventory Qty',
  'Variant Inventory Policy',
  'Variant Fulfillment Service',
  'Variant Price',
  'Variant Compare At Price',
  'Variant Requires Shipping',
  'Variant Taxable',
  'Variant Barcode',
  'Image Src',
  'Image Position',
  'Image Alt Text',
  'Gift Card',
  'SEO Title',
  'SEO Description',
  'Google Shopping / Google Product Category',
  'Google Shopping / Gender',
  'Google Shopping / Age Group',
  'Google Shopping / MPN',
  'Google Shopping / AdWords Grouping',
  'Google Shopping / AdWords Labels',
  'Google Shopping / Condition',
  'Google Shopping / Custom Product',
  'Google Shopping / Custom Label 0',
  'Google Shopping / Custom Label 1',
  'Google Shopping / Custom Label 2',
  'Google Shopping / Custom Label 3',
  'Google Shopping / Custom Label 4',
  'Variant Image',
  'Variant Weight Unit',
  'Variant Tax Code',
  'Cost per item',
  'Status',
]

function escapeCSVField(field: string | null | undefined): string {
  if (!field) return ''

  // Convert to string and escape quotes
  const str = String(field)

  // If field contains comma, newline, or quote, wrap in quotes and escape internal quotes
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`
  }

  return str
}

function convertWeightToGrams(weight: number | null, unit: string | null): number {
  if (!weight) return 0

  switch (unit?.toLowerCase()) {
    case 'kg':
      return weight * 1000
    case 'lb':
      return weight * 453.592
    case 'oz':
      return weight * 28.3495
    case 'g':
    default:
      return weight
  }
}

function generateHandle(productName: string): string {
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ catalogId: string }> },
) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { catalogId } = await params

    // Verify user has access to this catalog
    const { data: catalog, error: catalogError } = await supabase
      .from('product_catalogs')
      .select(`
        catalog_id,
        name,
        brands (
          id,
          name,
          user_id
        )
      `)
      .eq('catalog_id', catalogId)
      .single()

    if (catalogError || !catalog) {
      return NextResponse.json({ error: 'Catalog not found' }, { status: 404 })
    }

    if (catalog.brands?.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get all products with their variants and related data using a more complete query
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        product_catalogs (
          catalog_id,
          name,
          brands (
            id,
            name,
            user_id
          )
        ),
        categories (
          category_id,
          name
        ),
        product_variants (
          id,
          sku,
          barcode,
          price,
          compare_at_price,
          cost_per_item,
          weight,
          weight_unit,
          inventory_count,
          inventory_policy,
          is_active,
          attributes,
          status,
          sort_order
        ),
        product_attribute_schemas (
          id,
          attribute_key,
          attribute_label,
          options,
          is_required,
          sort_order
        ),
        product_images (
          id,
          url,
          alt_text,
          type,
          color_id,
          attribute_filters,
          sort_order
        )
      `)
      .eq('catalog_id', catalogId)
      .order('sort_order')
      .order('created_at')

    if (productsError) {
      console.error('Error fetching products:', productsError)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'No products found in catalog' }, { status: 404 })
    }

    // Build CSV rows
    const csvRows: string[][] = []
    csvRows.push(SHOPIFY_CSV_HEADERS)

    for (const product of products) {
      const handle = generateHandle(product.name)
      const vendor = catalog.brands?.name || ''
      const productCategory = product.categories?.name || ''
      const tags = product.tags?.join(', ') || ''
      const published = product.status === 'active' ? 'TRUE' : 'FALSE'

      // Get product options (attributes) from schemas
      const attributeSchemas = product.product_attribute_schemas || []
      const variantDefiningAttrs = attributeSchemas
        .filter((schema) => schema.attribute_key && schema.attribute_label)
        .slice(0, 3) // Shopify supports up to 3 options

      // Get first product image
      const productImages = product.product_images?.filter((img) => img.url) || []
      const mainImage =
        productImages.find((img) => img.sort_order === 0) || productImages[0]

      if (!product.product_variants || product.product_variants.length === 0) {
        // Product without variants
        csvRows.push([
          escapeCSVField(handle),
          escapeCSVField(product.name),
          escapeCSVField(product.description),
          escapeCSVField(vendor),
          escapeCSVField(productCategory),
          escapeCSVField(''),
          escapeCSVField(tags),
          escapeCSVField(published),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField('0'),
          escapeCSVField('shopify'),
          escapeCSVField('0'),
          escapeCSVField('deny'),
          escapeCSVField('manual'),
          escapeCSVField('0.00'),
          escapeCSVField(''),
          escapeCSVField('TRUE'),
          escapeCSVField('TRUE'),
          escapeCSVField(''),
          escapeCSVField(mainImage?.url || ''),
          escapeCSVField('1'),
          escapeCSVField(mainImage?.alt_text || ''),
          escapeCSVField('FALSE'),
          escapeCSVField(product.meta_title || ''),
          escapeCSVField(product.meta_description || ''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField('kg'),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(product.status),
        ])
      } else {
        // Product with variants
        const variants = product.product_variants.filter((v) => v.sku && v.price)

        variants.forEach((variant, variantIndex) => {
          const attributes = (variant.attributes as Record<string, any>) || {}

          // Extract option values
          const option1Value = variantDefiningAttrs[0]
            ? String(attributes[variantDefiningAttrs[0].attribute_key] || '')
            : ''
          const option2Value = variantDefiningAttrs[1]
            ? String(attributes[variantDefiningAttrs[1].attribute_key] || '')
            : ''
          const option3Value = variantDefiningAttrs[2]
            ? String(attributes[variantDefiningAttrs[2].attribute_key] || '')
            : ''

          // Find variant-specific image
          const variantImage = productImages.find((img) => {
            const filters = (img.attribute_filters as Record<string, any>) || {}
            return Object.keys(attributes).some((key) => filters[key] === attributes[key])
          })

          const imageToUse = variantImage || (variantIndex === 0 ? mainImage : null)

          csvRows.push([
            escapeCSVField(handle),
            escapeCSVField(variantIndex === 0 ? product.name : ''),
            escapeCSVField(variantIndex === 0 ? product.description : ''),
            escapeCSVField(variantIndex === 0 ? vendor : ''),
            escapeCSVField(variantIndex === 0 ? productCategory : ''),
            escapeCSVField(''),
            escapeCSVField(variantIndex === 0 ? tags : ''),
            escapeCSVField(variantIndex === 0 ? published : ''),
            escapeCSVField(
              variantIndex === 0 && variantDefiningAttrs[0]
                ? variantDefiningAttrs[0].attribute_label
                : '',
            ),
            escapeCSVField(option1Value),
            escapeCSVField(
              variantIndex === 0 && variantDefiningAttrs[1]
                ? variantDefiningAttrs[1].attribute_label
                : '',
            ),
            escapeCSVField(option2Value),
            escapeCSVField(
              variantIndex === 0 && variantDefiningAttrs[2]
                ? variantDefiningAttrs[2].attribute_label
                : '',
            ),
            escapeCSVField(option3Value),
            escapeCSVField(variant.sku),
            escapeCSVField(
              convertWeightToGrams(variant.weight, variant.weight_unit).toString(),
            ),
            escapeCSVField('shopify'),
            escapeCSVField(variant.inventory_count?.toString() || '0'),
            escapeCSVField(variant.inventory_policy || 'deny'),
            escapeCSVField('manual'),
            escapeCSVField(variant.price.toString()),
            escapeCSVField(variant.compare_at_price?.toString() || ''),
            escapeCSVField('TRUE'),
            escapeCSVField('TRUE'),
            escapeCSVField(variant.barcode || ''),
            escapeCSVField(imageToUse?.url || ''),
            escapeCSVField(imageToUse ? (variantIndex + 1).toString() : ''),
            escapeCSVField(imageToUse?.alt_text || ''),
            escapeCSVField('FALSE'),
            escapeCSVField(variantIndex === 0 ? product.meta_title || '' : ''),
            escapeCSVField(variantIndex === 0 ? product.meta_description || '' : ''),
            escapeCSVField(''),
            escapeCSVField(''),
            escapeCSVField(''),
            escapeCSVField(''),
            escapeCSVField(''),
            escapeCSVField(''),
            escapeCSVField(''),
            escapeCSVField(''),
            escapeCSVField(''),
            escapeCSVField(''),
            escapeCSVField(''),
            escapeCSVField(''),
            escapeCSVField(''),
            escapeCSVField(variantImage?.url || ''),
            escapeCSVField(variant.weight_unit || 'kg'),
            escapeCSVField(''),
            escapeCSVField(variant.cost_per_item?.toString() || ''),
            escapeCSVField(variant.status),
          ])
        })
      }
    }

    // Convert to CSV string
    const csvContent = csvRows.map((row) => row.join(',')).join('\n')

    // Create filename
    const catalogName = catalog.name.replace(/[^a-zA-Z0-9]/g, '_')
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `${catalogName}_products_${timestamp}.csv`

    // Return CSV response
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting CSV:', error)
    return NextResponse.json({ error: 'Failed to export CSV' }, { status: 500 })
  }
}
