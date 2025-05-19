// prettier.config.mjs

/** @type {import('prettier').Config} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  semi: true,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'es5',
  useTabs: true,
};

export default config;
