import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        alfa: {
          dark: '#0f1115',
          darker: '#080a0d',
          gray: '#1a1d24',
          'gray-light': '#2a2d35',
          blue: '#00d4ff',
          'blue-dark': '#0099cc',
          purple: '#a855f7',
          'purple-dark': '#7c3aed',
          white: '#ffffff',
          'white-50': 'rgba(255, 255, 255, 0.05)',
          'white-10': 'rgba(255, 255, 255, 0.1)',
          'white-20': 'rgba(255, 255, 255, 0.2)',
        },
      },
      backgroundImage: {
        'gradient-alfa': 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
        'gradient-alfa-dark': 'linear-gradient(135deg, #0099cc 0%, #7c3aed 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0, 212, 255, 0.5)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.5)',
        'glow-alfa': '0 0 30px rgba(0, 212, 255, 0.3), 0 0 60px rgba(168, 85, 247, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.6), 0 0 60px rgba(168, 85, 247, 0.4)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
