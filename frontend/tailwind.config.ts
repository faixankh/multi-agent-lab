import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        muted: '#64748b',
        line: '#dbe4ef',
        panel: '#ffffff',
        soft: '#f1f5f9',
        brand: '#2563eb',
        success: '#059669',
        warning: '#d97706',
        danger: '#dc2626'
      },
      boxShadow: {
        soft: '0 18px 50px rgba(15, 23, 42, 0.08)',
        card: '0 10px 28px rgba(15, 23, 42, 0.07)'
      }
    }
  },
  plugins: []
};
export default config;
