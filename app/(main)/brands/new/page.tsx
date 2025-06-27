import { Container, HStack, styled } from '@/styled-system/jsx'
import BrandChat from '@/components/brands/brand-chat'
import { HeaderBar } from '@/components/layout/header-bar'
import { PageContainer } from '@/components/ui/page-container'

export default async function CreateBrandPage() {
  return (
    <PageContainer>
      <HeaderBar>
        <HStack px={8}>
          <styled.p fontSize="sm" fontWeight="medium">
            Brands
          </styled.p>
          <styled.p fontSize="sm" color="accent">
            /
          </styled.p>
          <styled.p fontSize="sm" color="fg.muted">
            Create
          </styled.p>
        </HStack>
      </HeaderBar>

      <BrandChat />
    </PageContainer>
  )
}
