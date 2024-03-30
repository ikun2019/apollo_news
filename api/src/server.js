import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';

import { resolvers } from './graphql/resolvers.js';

// * App
const app = express();
app.use(express.json(), cors());

// * Prisma
const prisma = new PrismaClient();

// * server作成
const typeDefs = await fs.readFile('./src/graphql/schema.graphql', 'utf-8');

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ prisma })
});
await apolloServer.start();

// * router
app.use('/graphql', apolloServer.getMiddleware({
  path: '/',
  cors: true
}));

app.listen({ port: 8000 }, () => {
  console.log('Server is running');
});