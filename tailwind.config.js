/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mac-gray': '#c0c0c0',
        'mac-blue': '#000080',
        'mac-white': '#ffffff',
      },
      fontFamily: {
        retro: ['"VT323"', 'monospace'],
      },
      cursor: {
        'mac-default': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewport=\'0 0 100 100\' style=\'fill:black;font-size:24px;\'><text y=\'50%\'>👆</text></svg>") 16 0, auto',
      }
    },
  },
  plugins: [],
}
