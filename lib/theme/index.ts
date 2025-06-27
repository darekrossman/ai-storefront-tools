import { defineSemanticTokens } from '@pandacss/dev'

export const semanticTokens = defineSemanticTokens({
  colors: {
    accent: {
      DEFAULT: { value: { base: '#D86042', _dark: '#D86042' } },
      hover: { value: { base: '#D86042', _dark: '#D86042' } },
    },
    bg: {
      DEFAULT: { value: { base: '{colors.zinc.100}', _dark: '{colors.zinc.900}' } },
      light: { value: { base: '{colors.zinc.100}', _dark: '{colors.zinc.900}' } },
      dark: { value: { base: '{colors.zinc.900}', _dark: '{colors.zinc.100}' } },
      hover: { value: { base: '{colors.zinc.200}', _dark: '{colors.zinc.800}' } },
    },
    fg: {
      DEFAULT: { value: { base: '{colors.zinc.900}', _dark: '{colors.zinc.100}' } },
      light: { value: { base: '{colors.zinc.100}', _dark: '{colors.zinc.900}' } },
      dark: { value: { base: '{colors.zinc.900}', _dark: '{colors.zinc.100}' } },
      muted: { value: { base: '{colors.zinc.500}', _dark: '{colors.zinc.400}' } },
      hover: { value: { base: '{colors.zinc.900}', _dark: '{colors.zinc.100}' } },
    },
    border: {
      base: { value: { base: '{colors.zinc.200}', _dark: '{colors.zinc.800}' } },
      light: { value: { base: '{colors.zinc.200}', _dark: '{colors.zinc.800}' } },
      dark: { value: { base: '{colors.zinc.800}', _dark: '{colors.zinc.200}' } },
      hover: { value: { base: '{colors.zinc.800}', _dark: '{colors.zinc.200}' } },
    },
  },

  borders: {
    base: {
      value: {
        base: '1px solid {colors.border.base}',
        _dark: '1px solid {colors.border.base}',
      },
    },
  },
})

// Re-export keyframes for convenience
export { keyframes } from './keyframes'
