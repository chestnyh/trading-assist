
export default {
  api: {
    input: './openapi.json', // Path relative to this config file
    output: {
      target: './src/lib/api-client.ts',
      client: 'fetch', // Use fetch for HTTP requests
      mode: 'tags-split',
      schemas: './src/lib', // Output directory for Zod schemas
      zod: true, // Generate Zod schemas for validation
      override: {
        mutator: {
          path: './src/api/mutator.ts',
          name: 'customInstance',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
};