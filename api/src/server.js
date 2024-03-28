import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';

import { resolvers } from './graphql/resolvers.js';

// * App
const app = express();
app.use(express.json(), cors());


// * server作成
const typeDefs = await fs.readFile('./src/graphql/schema.graphql', 'utf-8');

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});
await apolloServer.start();

// * router
app.use('/graphql', expressMiddleware(apolloServer));

app.listen({ port: 8000 }, () => {
  console.log('Server is running');
});