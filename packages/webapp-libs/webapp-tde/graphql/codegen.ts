import { CodegenConfig } from '@graphql-codegen/cli';

const config: Partial<CodegenConfig> = {
  generates: {
    'src/graphql/__generated/gql/': {
      documents: [
        '../webapp-tde/src/**/*.ts',
        '../webapp-tde/src/**/*.tsx',
      ],
      plugins: [],
    },
  },
};

export default config;
