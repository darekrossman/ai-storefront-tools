import { NextRequest, NextResponse } from 'next/server'
import { getProductsByBrand } from '@/actions/products'
import { getBrandAction } from '@/actions/brands'
import JSZip from 'jszip'

interface RouteParams {
  params: Promise<{
    brandId: string
  }>
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const { brandId } = await params
    const brandIdNum = parseInt(brandId)

    if (isNaN(brandIdNum)) {
      return NextResponse.json({ error: 'Invalid brand ID' }, { status: 400 })
    }

    // Get brand details
    const brand = await getBrandAction(brandIdNum)
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    // Get all products for the brand
    const products = await getProductsByBrand(brandIdNum)

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'No products found for this brand' },
        { status: 404 },
      )
    }

    // Extract all image URLs
    const imageData: Array<{
      url: string
      filename: string
      productName: string
    }> = []

    products.forEach((product) => {
      if (product.product_images && product.product_images.length > 0) {
        product.product_images.forEach((image, index) => {
          // Create safe filename
          const productNameSafe = product.name
            .replace(/[^a-zA-Z0-9\s-]/g, '')
            .replace(/\s+/g, '_')

          // Extract file extension from URL
          const urlParts = image.url.split('.')
          const extension = urlParts.length > 1 ? urlParts.pop() : 'jpg'

          const filename = `${productNameSafe}_${index + 1}.${extension}`

          imageData.push({
            url: image.url,
            filename,
            productName: product.name,
          })
        })
      }
    })

    if (imageData.length === 0) {
      return NextResponse.json(
        { error: 'No images found for products in this brand' },
        { status: 404 },
      )
    }

    // Create ZIP file
    const zip = new JSZip()

    // Download all images and add to ZIP
    const downloadPromises = imageData.map(async (image) => {
      try {
        const response = await fetch(image.url)
        if (!response.ok) {
          console.warn(`Failed to download image: ${image.url}`)
          return null
        }

        const arrayBuffer = await response.arrayBuffer()
        return {
          filename: image.filename,
          data: arrayBuffer,
          productName: image.productName,
        }
      } catch (error) {
        console.warn(`Error downloading image ${image.url}:`, error)
        return null
      }
    })

    const downloadResults = await Promise.all(downloadPromises)
    const validImages = downloadResults.filter((result) => result !== null)

    if (validImages.length === 0) {
      return NextResponse.json(
        { error: 'Failed to download any images' },
        { status: 500 },
      )
    }

    // Add all images directly to ZIP root (no subdirectories)
    validImages.forEach((image) => {
      if (!image) return
      zip.file(image.filename, image.data)
    })

    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    // Create filename with brand name and timestamp
    const timestamp = new Date().toISOString().slice(0, 10)
    const brandNameSafe = brand.name.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '_')
    const filename = `${brandNameSafe}_images_${timestamp}.zip`

    // Return ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error exporting images:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
