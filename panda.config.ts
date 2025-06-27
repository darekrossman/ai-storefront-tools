import { defineConfig } from '@pandacss/dev'
import { semanticTokens } from './lib/theme'
import { keyframes } from './lib/theme/keyframes'

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './ui/**/*.{ts,tsx,js,jsx}',
    './lib/theme/**/*.{ts,tsx,js,jsx}',
  ],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        sizes: {
          headerHeight: { value: '60px' },
          sidebarWidth: { value: '212px' },
        },
      },
      semanticTokens,
      keyframes,
    },
  },

  globalCss: {
    '*': {
      // textBoxEdge: 'cap alphabetic',
      // textBoxTrim: 'trim-both',
      textWrap: 'pretty',
    },
    input: {
      textBox: 'none!important',
    },
    button: {
      cursor: 'pointer',
    },
  },

  jsxFramework: 'react',

  // The output directory for your css system
  outdir: 'styled-system',
})
