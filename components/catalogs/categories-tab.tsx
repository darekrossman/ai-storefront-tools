import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { getCategoriesAction } from '@/actions/categories'
import type { Category } from '@/lib/supabase/database-types'

interface CategoriesTabProps {
  catalogId: string
  projectId: number
}

export default async function CategoriesTab({
  catalogId,
  projectId,
}: CategoriesTabProps) {
  let categories: Category[] = []
  let error: string | null = null

  try {
    categories = await getCategoriesAction(catalogId)
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load categories'
  }

  if (error) {
    return (
      <Box
        bg="red.50"
        border="1px solid"
        borderColor="red.200"
        borderRadius="lg"
        p={6}
        textAlign="center"
      >
        <Stack gap={2} align="center">
          <styled.h3 fontSize="lg" fontWeight="medium" color="red.900">
            Error Loading Categories
          </styled.h3>
          <styled.p fontSize="sm" color="red.700">
            {error}
          </styled.p>
        </Stack>
      </Box>
    )
  }

  return (
    <Stack gap={6}>
      <Flex justify="space-between" align="center">
        <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
          Categories
        </styled.h2>
        <Link
          href={`/dashboard/projects/${projectId}/catalogs/${catalogId}/categories/new`}
        >
          <styled.button
            px={4}
            py={2}
            bg="blue.600"
            color="white"
            borderRadius="lg"
            fontSize="sm"
            fontWeight="medium"
            cursor="pointer"
            _hover={{
              bg: 'blue.700',
            }}
            transition="all 0.2s"
          >
            Add Category
          </styled.button>
        </Link>
      </Flex>

      {/* Categories List */}
      {categories.length === 0 ? (
        <Box
          bg="white"
          border="2px dashed"
          borderColor="gray.200"
          borderRadius="lg"
          p={12}
          textAlign="center"
        >
          <Stack gap={4} align="center" maxW="md" mx="auto">
            <Box
              w={16}
              h={16}
              bg="gray.100"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <styled.div fontSize="2xl" color="gray.400">
                📁
              </styled.div>
            </Box>

            <Stack gap={2} textAlign="center">
              <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                No categories yet
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                Organize your products by creating categories. Categories help customers
                navigate your catalog and find products more easily.
              </styled.p>
            </Stack>

            <Link
              href={`/dashboard/projects/${projectId}/catalogs/${catalogId}/categories/new`}
            >
              <styled.button
                px={6}
                py={3}
                bg="blue.600"
                color="white"
                borderRadius="lg"
                fontSize="sm"
                fontWeight="medium"
                cursor="pointer"
                _hover={{
                  bg: 'blue.700',
                }}
                transition="all 0.2s"
              >
                Create Your First Category
              </styled.button>
            </Link>
          </Stack>
        </Box>
      ) : (
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          overflow="hidden"
        >
          <styled.table w="full">
            <styled.thead bg="gray.50">
              <styled.tr>
                <styled.th
                  textAlign="left"
                  px={6}
                  py={3}
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Name
                </styled.th>
                <styled.th
                  textAlign="left"
                  px={6}
                  py={3}
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Description
                </styled.th>
                <styled.th
                  textAlign="left"
                  px={6}
                  py={3}
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Parent
                </styled.th>
                <styled.th
                  textAlign="left"
                  px={6}
                  py={3}
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Status
                </styled.th>
                <styled.th
                  textAlign="left"
                  px={6}
                  py={3}
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Created
                </styled.th>
                <styled.th
                  textAlign="right"
                  px={6}
                  py={3}
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  w={24}
                >
                  Actions
                </styled.th>
              </styled.tr>
            </styled.thead>
            <styled.tbody>
              {categories.map((category) => (
                <CategoryTableRow
                  key={category.id}
                  category={category}
                  categories={categories}
                  projectId={projectId}
                  catalogId={catalogId}
                />
              ))}
            </styled.tbody>
          </styled.table>
        </Box>
      )}
    </Stack>
  )
}

// Category Table Row Component
interface CategoryTableRowProps {
  category: Category
  categories: Category[]
  projectId: number
  catalogId: string
}

function CategoryTableRow({
  category,
  categories,
  projectId,
  catalogId,
}: CategoryTableRowProps) {
  const getStatusColor = (status: boolean) => {
    return status
      ? { bg: 'green.100', color: 'green.700', text: 'Active' }
      : { bg: 'gray.100', color: 'gray.700', text: 'Inactive' }
  }

  const statusColor = getStatusColor(category.is_active)
  const parentCategory = categories.find(
    (cat) => cat.category_id === category.parent_category_id,
  )

  return (
    <styled.tr
      borderBottom="1px solid"
      borderColor="gray.100"
      _hover={{ bg: 'gray.50' }}
      transition="all 0.2s"
    >
      {/* Category Name */}
      <styled.td px={6} py={4}>
        <Stack gap={1}>
          <styled.span fontSize="sm" fontWeight="medium" color="gray.900">
            {category.name}
          </styled.span>
          <styled.span fontSize="xs" color="gray.500" fontFamily="mono">
            /{category.slug}
          </styled.span>
        </Stack>
      </styled.td>

      {/* Description */}
      <styled.td px={6} py={4}>
        {category.description ? (
          <styled.p
            fontSize="sm"
            color="gray.600"
            overflow="hidden"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {category.description}
          </styled.p>
        ) : (
          <styled.span fontSize="sm" color="gray.400">
            —
          </styled.span>
        )}
      </styled.td>

      {/* Parent Category */}
      <styled.td px={6} py={4}>
        {parentCategory ? (
          <styled.span fontSize="sm" color="gray.600">
            {parentCategory.name}
          </styled.span>
        ) : (
          <styled.span fontSize="sm" color="gray.400">
            —
          </styled.span>
        )}
      </styled.td>

      {/* Status */}
      <styled.td px={6} py={4}>
        <styled.span
          fontSize="xs"
          fontWeight="medium"
          px={2}
          py={1}
          borderRadius="md"
          bg={statusColor.bg}
          color={statusColor.color}
        >
          {statusColor.text}
        </styled.span>
      </styled.td>

      {/* Created Date */}
      <styled.td px={6} py={4}>
        <styled.span fontSize="sm" color="gray.600">
          {new Date(category.created_at).toLocaleDateString()}
        </styled.span>
      </styled.td>

      {/* Actions */}
      <styled.td px={6} py={4}>
        <Flex gap={2} justify="end">
          <Link
            href={`/dashboard/projects/${projectId}/catalogs/${catalogId}/categories/${category.id}/edit`}
          >
            <styled.button
              px={3}
              py={1}
              fontSize="xs"
              fontWeight="medium"
              color="gray.600"
              bg="white"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              cursor="pointer"
              _hover={{
                bg: 'gray.50',
                borderColor: 'gray.400',
              }}
              transition="all 0.2s"
            >
              Edit
            </styled.button>
          </Link>
        </Flex>
      </styled.td>
    </styled.tr>
  )
}
