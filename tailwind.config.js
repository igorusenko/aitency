/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b0f17',
        panel: '#101827',
        'panel-2': '#0f1624',
        muted: '#9fb0c3',
        text: '#e7eef7',
        border: 'rgba(255,255,255,.08)',
        accent: '#7c5cff',
        good: '#22c55e',
        warn: '#f59e0b',
        bad: '#ef4444',
      },
      borderRadius: {
        'custom': '14px',
        'custom-sm': '10px',
      },
      boxShadow: {
        'custom': '0 10px 30px rgba(0,0,0,.35)',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [
    require('tailwindcss-primeui'),
    require('@tailwindcss/typography'),
  ],
}

