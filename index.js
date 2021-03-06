const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");

const MONGODB = process.env.MONGODB;
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected.");

    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server listening on ${res.url}`);
  })
  .catch((err) => {
    console.error(err);
  });
