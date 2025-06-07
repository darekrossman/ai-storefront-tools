import './globals.css'
import { styled } from '@/styled-system/jsx'
import { PropsWithChildren } from 'react'

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <styled.html lang="en" minH="100dvh">
      <styled.body minH="100dvh" display="flex" flexDir="column">
        {children}
      </styled.body>
    </styled.html>
  )
}
