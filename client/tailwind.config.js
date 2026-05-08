/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#111111',
        apuBlue: '#AA003E',
        cta: '#AA003E',
        ink: '#111111',
        mist: '#F6F4F1',
        'apu-crimson': '#AA003E',
        'crimson-dark': '#76002D',
        paper: '#FFFFFF',
        line: '#D9D4CE',
        graphite: '#2E2E2E',
        gold: '#B79A57'
      },
      fontFamily: {
        heading: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        body: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']
      },
      boxShadow: {
        soft: '0 12px 28px rgba(17, 17, 17, 0.08)'
      }
    }
  },
  plugins: []
};
