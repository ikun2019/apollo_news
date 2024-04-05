const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { getUserId } = require('./utils.js');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const { useServer: useWsServer } = require('graphql-ws/lib/use/ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const Query = require('./graphql/resolvers/Query.js');
const Mutation = require('./graphql/resolvers/Mutation.js');
const User = require('./graphql/resolvers/User.js');
const Link = require('./graphql/resolvers/Link.js');
const Subscription = require('./graphql/resolvers/Subscriptions.js');

// * Subscriptions
const { PubSub } = require('graphql-subscriptions');

// * App
const app = express();
const httpServer = createServer(app);
const webServer = new WebSocketServer({ server: httpServer, path: '/graphql' }); // subscriptionのエンドポイントの指定

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
  Subscription,
  User,
  Link,
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({
  schema
});

(async () => {
  await apolloServer.start();
  app.use('/graphql', expressMiddleware(apolloServer, {
    context: ({ req, res }) => ({
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    }),
  }));
  useWsServer({
    schema,
    context: ({ req, res }) => ({
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    }),
  }, webServer);
  httpServer.listen({ port: 8000 }, () => {
    console.log('server is running');
  });
})();

