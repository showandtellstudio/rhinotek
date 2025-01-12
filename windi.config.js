import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'
import plugin from 'windicss/plugin'

export default defineConfig({
  theme: {
    screens: {
      '@m': { max: '767px' },
      '@l': { max: '983px' },
      '@x': { max: '1199px' }
    },
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '984px',
        'xl': '1200px',
        '2xl': '1376px',
        '3xl': '1536px'
      },
      fontFamily: {
        arada: ['Arada', 'sans-serif'],
        mayenne: ['Mayenne Sans', 'sans-serif']
      },
      colors: {
        primary: 'var(--color-primary)',
        text: 'var(--color-text)'
      },
      fontSize: {
        'xs': ['1rem', '1.3rem'],
        'sm': ['1.1rem', '1.5rem'],
        'base': ['1.2rem', '1.6rem'],
      }
    }
  },
  safelist: [
  ],
  extract: {
    include: [
      'templates/**/*.twig',
    ]
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        /*'h1': {
          letterSpacing: '-0.025em',
        },*/
      })
    })
  ]
})