const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { getUserId } = require('./utils.js');

const Query = require('./graphql/resolvers/Query.js');
const Mutation = require('./graphql/resolvers/Mutation.js');
const User = require('./graphql/resolvers/User.js');
const Link = require('./graphql/resolvers/Link.js');

// * Subscriptions
const { PubSub } = require('graphql-subscriptions');

// * App
const app = express();
app.use(express.json(), cors());

// * Prisma
const prisma = new PrismaClient();
const pubsub = new PubSub();

// * GraphQL Schemaの読み込み
const typeDefs = fs.readFileSync(path.join(__dirname, './graphql/schema.graphql'), 'utf-8');

// * リゾルバ関数のインポート
const resolvers = {
  Query,
  Mutation,
  User,
  Link,
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    ...req,
    prisma,
    pubsub,
    userId: req && req.headers.authorization ? getUserId(req) : null,
  }),
});

async function startServer() {
  await apolloServer.start();
  // * router
  app.use('/graphql', apolloServer.getMiddleware({
    path: '/',
    cors: true
  }));
};
startServer();

app.listen({ port: 8000 }, () => {
  console.log('Server is running');
});