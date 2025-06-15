import { defineConfig } from '@pandacss/dev'
import theme from './panda.theme.extend.json'

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './ui/**/*.{ts,tsx,js,jsx}',
  ],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: theme,
  },

  globalCss: {
    '*': {
      textBoxEdge: 'cap alphabetic',
      textBoxTrim: 'trim-both',
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
