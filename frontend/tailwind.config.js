/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#0f0f1e',
        },
      },
      backdropFilter: {
        'none': 'none',
        'sm': 'blur(4px)',
        'md': 'blur(8px)',
        'lg': 'blur(12px)',
        'xl': 'blur(16px)',
      },
      backgroundColor: {
        glass: 'rgba(31, 41, 55, 0.1)',
      },
      borderColor: {
        glass: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
