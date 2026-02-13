import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        discord: {
          blurple: '#5865F2',
          green: '#23A559',
          yellow: '#F0B232',
          red: '#F23F43',
          gray: '#80848E',
        },
        neon: {
          blue: '#00f2ff',
          pink: '#ff007f',
          purple: '#bc13fe',
          green: '#39ff14',
        }
      },
      boxShadow: {
        'neon-blue': '0 0 5px #00f2ff, 0 0 20px #00f2ff',
        'neon-pink': '0 0 5px #ff007f, 0 0 20px #ff007f',
        'neon-purple': '0 0 5px #bc13fe, 0 0 20px #bc13fe',
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(45deg, #00f2ff, #bc13fe, #ff007f)',
      }
    },
  },
  plugins: [],
}
export default config
