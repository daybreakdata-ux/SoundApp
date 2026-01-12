/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f0f0f',
          surface: '#1a1a1a',
          border: '#2a2a2a',
          text: '#e0e0e0',
          textMuted: '#888888',
        },
        accent: '#00a8ff',
        accentDark: '#0088cc',
        warning: '#ff6b35',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
        'gradient-accent': 'linear-gradient(135deg, #00a8ff 0%, #0088cc 100%)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
