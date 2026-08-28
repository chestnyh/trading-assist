module.exports = {
  // Required by reference, not by name: postcss-loader resolves string plugin
  // names from its own location in the pnpm store, which cannot reach this
  // workspace's node_modules.
  plugins: [
    require('@tailwindcss/postcss')({
      config: './tailwind.config.js',
    }),
  ],
};
