import { getBrandAction } from '../brands'
import { getCategoriesAction } from '../categories'
import { getProductCatalogAction } from '../product-catalogs'
import { getProducts } from '../products'

export async function getContextForCatalog(catalogId: string) {
  const catalog = await getProductCatalogAction(catalogId)

  if (!catalog) {
    return Response.json({ error: 'Catalog not found' }, { status: 404 })
  }

  const brand = await getBrandAction(catalog.brand_id)

  if (!brand) {
    return Response.json({ error: 'Brand not found' }, { status: 404 })
  }

  const categories = await getCategoriesAction(catalog.catalog_id)
  const parentCategories = categories.filter((c) => !c.parent_category_id)
  const subcategories = categories.filter((c) => c.parent_category_id)

  const existingProducts = await getProducts(catalogId)
  const existingProductNames = existingProducts.map((product) => product.name)

  const { id, user_id, status, created_at, updated_at, logo_url, ...brandData } = brand

  const contextData = {
    brand: brandData,
    catalogName: catalog.name,
    catalogDescription: catalog.description,
    existingProductNames: existingProductNames,
    categories: parentCategories.map((c) => ({
      category_id: c.category_id,
      name: c.name,
      description: c.description,
      subcategories: subcategories
        .filter((sc) => sc.parent_category_id === c.category_id)
        .map((sc) => ({
          category_id: sc.category_id,
          name: sc.name,
          description: sc.description,
        })),
    })),
  }

  return contextData
}
