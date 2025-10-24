/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Tema ALFA - Cores principais
        alfa: {
          primary: '#00D4FF',      // Azul neon
          secondary: '#8B5CF6',    // Roxo neon
          accent: '#F59E0B',       // Amarelo neon
          dark: '#0F1115',         // Fundo escuro
          darker: '#0A0B0F',       // Fundo mais escuro
          light: '#F8FAFC',        // Texto claro
          muted: '#64748B',        // Texto secundário
        },
        // Gradientes
        gradient: {
          'alfa-start': '#00D4FF',
          'alfa-end': '#8B5CF6',
          'glass-start': 'rgba(255, 255, 255, 0.1)',
          'glass-end': 'rgba(255, 255, 255, 0.05)',
        },
      },
      backgroundImage: {
        'gradient-alfa': 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0F1115 0%, #0A0B0F 100%)',
      },
      boxShadow: {
        'alfa': '0 0 20px rgba(0, 212, 255, 0.3)',
        'alfa-lg': '0 0 40px rgba(0, 212, 255, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'neon': '0 0 20px rgba(139, 92, 246, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};