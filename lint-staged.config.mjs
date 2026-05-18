export default {
  '*.{ts,js,mjs,css}': ['prettier --write', 'eslint --fix'],
  '*.{json,yml,yaml,scss,md}': ['prettier --write'],
}
