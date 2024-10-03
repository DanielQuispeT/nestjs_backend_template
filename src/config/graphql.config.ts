import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';

export const GRAPHQL_CONFIG = {
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  formatError: (error) => ({
    message: error.message,
    status: error.extensions.code,
    locations: error.locations,
    path: error.path,
    extensions: error.extensions,
  }),
};
