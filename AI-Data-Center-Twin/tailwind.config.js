/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        carbon: {
          950: '#050608',
          900: '#0a0c10',
          800: '#101319',
          700: '#181c24',
          600: '#232833',
        },
        cyan: {
          glow: '#4df1ff',
          core: '#00e5ff',
        },
        violet: {
          glow: '#a78bfa',
          core: '#7c3aed',
        },
        status: {
          ok: '#22ffb0',
          warn: '#ffd23f',
          danger: '#ff4d5e',
        },
      },
      fontFamily: {
        display: ['"Orbitron"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 229, 255, 0.35)',
        'glow-violet': '0 0 20px rgba(124, 58, 237, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        scan: 'scan 2.4s linear infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
