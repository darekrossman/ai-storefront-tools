'use client'

import { Box, Stack, styled } from '@/styled-system/jsx'
import type { Brand } from '@/lib/supabase/database-types'
import { stack } from '@/styled-system/patterns'

interface BrandDetailsProps {
  brand: Brand
}

const formatLabel = (key: string) =>
  key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const renderValue = (value: any) => {
  if (value === null || value === undefined || value === '')
    return <styled.span color="gray.500">-</styled.span>
  if (Array.isArray(value)) {
    return value.length ? (
      <styled.ul listStyleType="disc" pl="1.5em" className={stack({ gap: 2 })}>
        {value.map((item, index) => (
          <styled.li
            key={index}
            fontSize="xs"
            lineHeight="1.3"
            _marker={{ color: 'gray.400' }}
          >
            {String(item)}
          </styled.li>
        ))}
      </styled.ul>
    ) : (
      <styled.span color="gray.500">-</styled.span>
    )
  }
  return String(value)
}

const DetailItem = ({ label, value }: { label: string; value: any }) => (
  <styled.div
    display="grid"
    gridTemplateColumns={{ md: '180px 1fr' }}
    gap="0"
    alignItems="start"
  >
    <styled.dt fontSize="xs" fontWeight="medium" color="gray.700" lineHeight="1.3">
      {label}
    </styled.dt>
    <styled.dd fontSize="xs" color="gray.900" lineHeight="1.3">
      {renderValue(value)}
    </styled.dd>
  </styled.div>
)

const DetailSection = ({
  title,
  data,
  keys,
}: {
  title: string
  data: Brand
  keys: (keyof Brand)[]
}) => {
  const relevantEntries = (Object.entries(data) as [keyof Brand, any][]).filter(
    ([key, value]) =>
      keys.includes(key) && value !== null && (!Array.isArray(value) || value.length > 0),
  )

  if (relevantEntries.length === 0) return null

  return (
    <Stack gap={4}>
      <styled.h3 fontSize="md" fontWeight="semibold" color="gray.800">
        {title}
      </styled.h3>
      <Stack gap={4} divideY="1px" divideColor="gray.200" divideStyle="dashed">
        {relevantEntries.map(([key, value]) => (
          <Box key={String(key)} pt={4}>
            <DetailItem label={formatLabel(String(key))} value={value} />
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}

const IDENTITY_KEYS: (keyof Brand)[] = [
  'tagline',
  'status',
  'mission',
  'vision',
  'values',
  'brand_voice',
  'brand_tone',
  'personality_traits',
  'communication_style',
  'brand_archetype',
]

const POSITIONING_KEYS: (keyof Brand)[] = [
  'category',
  'differentiation',
  'competitive_advantages',
  'price_point',
  'market_position',
  'target_age_range',
  'target_income',
  'target_education',
  'target_location',
  'target_lifestyle',
  'target_interests',
  'target_values',
  'target_pain_points',
  'target_needs',
]

const CREATIVE_KEYS: (keyof Brand)[] = [
  'logo_description',
  'color_scheme',
  'design_principles',
  'typography_primary',
  'typography_secondary',
  'typography_accent',
  'imagery_style',
  'imagery_mood',
  'imagery_guidelines',
]

export default function BrandDetails({ brand }: BrandDetailsProps) {
  return (
    <Stack gap={16}>
      <DetailSection title="Brand Identity" data={brand} keys={IDENTITY_KEYS} />
      <DetailSection
        title="Market Positioning & Audience"
        data={brand}
        keys={POSITIONING_KEYS}
      />
      <DetailSection
        title="Creative & Visual Guidelines"
        data={brand}
        keys={CREATIVE_KEYS}
      />
    </Stack>
  )
}
