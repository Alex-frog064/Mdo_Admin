
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",  // Agrega esto si usas un archivo HTML principal
    "./src/**/*.{html,js,ts,jsx,tsx}", // Asegura que también escanea archivos HTML
  ],
  theme: {
    extend: {
      colors: {
        blue1: '#2B7A77',
        blue2: '#73B6B2',
        gray: '#5B5B5B'
      }
    },
  },
  plugins: [ 
  ],
};
