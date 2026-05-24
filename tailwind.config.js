/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: 'var(--paymint-primary-600)',
          hover: 'var(--paymint-primary-500)',
          light: 'var(--paymint-primary-50)',
          dark: 'var(--paymint-primary-900)',
          50: 'var(--paymint-primary-50)',
          100: 'var(--paymint-primary-100)',
          200: 'var(--paymint-primary-200)',
          300: 'var(--paymint-primary-300)',
          400: 'var(--paymint-primary-400)',
          500: 'var(--paymint-primary-500)',
          600: 'var(--paymint-primary-600)',
          700: 'var(--paymint-primary-700)',
          800: 'var(--paymint-primary-800)',
          900: 'var(--paymint-primary-900)',
        },
        surface: {
          bg: 'var(--paymint-surface-bg)',
          card: 'var(--paymint-surface-card)',
          subtle: 'var(--paymint-surface-subtle)',
          border: 'var(--paymint-surface-border)',
          divider: 'var(--paymint-surface-divider)',
        },
        ink: {
          primary: 'var(--paymint-text-primary)',
          secondary: 'var(--paymint-text-secondary)',
          tertiary: 'var(--paymint-text-tertiary)',
          disabled: 'var(--paymint-text-disabled)',
          inverse: 'var(--paymint-text-inverse)',
        },
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(15, 25, 35, 0.04)',
        md: '0 2px 8px -2px rgba(15, 25, 35, 0.08), 0 1px 2px 0 rgba(15, 25, 35, 0.04)',
        lg: '0 8px 24px -4px rgba(15, 25, 35, 0.10), 0 2px 8px -2px rgba(15, 25, 35, 0.06)',
        xl: '0 20px 48px -8px rgba(15, 25, 35, 0.12), 0 8px 16px -4px rgba(15, 25, 35, 0.06)',
        modal: '0 24px 64px -12px rgba(15, 25, 35, 0.16)',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '15': '60px',
        '18': '72px',
        '22': '88px',
      },
      animation: {
        'fade-in-up': 'fade-in-up 240ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slide-in-right 280ms cubic-bezier(0.16, 1, 0.3, 1)',
        'skeleton-shimmer': 'skeleton-shimmer 1.4s linear infinite',
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'skeleton-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
