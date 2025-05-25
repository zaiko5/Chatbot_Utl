module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',  // clave para imports/exports
  },
  plugins: ['bot-whatsapp'],
  extends: ['plugin:bot-whatsapp/recommended'],
};
