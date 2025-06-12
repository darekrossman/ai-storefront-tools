import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { button } from '@/components/ui/button'
import { styled } from '@/styled-system/jsx'

export default async function BrandsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  const { data: brands, error: brandsError } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (brandsError) {
    console.error('Error fetching brands:', brandsError)
  }

  return (
    <styled.div maxW="7xl" mx="auto" p={6}>
      <styled.div mb={8}>
        <styled.div
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <styled.h1 fontSize="3xl" fontWeight="bold" color="gray.900">
            Your Brands
          </styled.h1>
          <Link href="/dashboard/brands/new" className={button({ variant: 'primary' })}>
            Create New Brand
          </Link>
        </styled.div>
        <styled.p color="gray.600">
          Manage your brand identities and product catalogs
        </styled.p>
      </styled.div>

      {brands && brands.length > 0 ? (
        <styled.div
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(320px, 1fr))"
          gap={6}
        >
          {brands.map((brand) => (
            <Link key={brand.id} href={`/dashboard/brands/${brand.id}`}>
              <styled.div
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                p={6}
                cursor="pointer"
                _hover={{ borderColor: 'gray.300', shadow: 'sm' }}
                transition="all 0.2s"
              >
                <styled.div mb={4}>
                  <styled.h3 fontSize="xl" fontWeight="semibold" color="gray.900" mb={2}>
                    {brand.name}
                  </styled.h3>
                  {brand.tagline && (
                    <styled.p fontSize="sm" color="gray.600" mb={3}>
                      {brand.tagline}
                    </styled.p>
                  )}
                  {brand.category && (
                    <styled.span
                      display="inline-block"
                      bg="blue.50"
                      color="blue.700"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="medium"
                    >
                      {brand.category}
                    </styled.span>
                  )}
                </styled.div>

                <styled.div
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderTop="1px solid"
                  borderColor="gray.100"
                  pt={4}
                >
                  <styled.div fontSize="sm" color="gray.500">
                    {brand.status === 'draft' && (
                      <styled.span color="yellow.600">Draft</styled.span>
                    )}
                    {brand.status === 'active' && (
                      <styled.span color="green.600">Active</styled.span>
                    )}
                    {brand.status === 'inactive' && (
                      <styled.span color="gray.600">Inactive</styled.span>
                    )}
                    {brand.status === 'archived' && (
                      <styled.span color="red.600">Archived</styled.span>
                    )}
                  </styled.div>
                  <styled.div fontSize="sm" color="gray.500">
                    {new Date(brand.created_at).toLocaleDateString()}
                  </styled.div>
                </styled.div>
              </styled.div>
            </Link>
          ))}
        </styled.div>
      ) : (
        <styled.div
          textAlign="center"
          py={12}
          bg="gray.50"
          borderRadius="lg"
          border="2px dashed"
          borderColor="gray.200"
        >
          <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900" mb={2}>
            No brands yet
          </styled.h3>
          <styled.p color="gray.500" mb={6}>
            Create your first brand to get started with your storefront
          </styled.p>
          <Link href="/dashboard/brands/new" className={button({ variant: 'primary' })}>
            Create Your First Brand
          </Link>
        </styled.div>
      )}
    </styled.div>
  )
}
