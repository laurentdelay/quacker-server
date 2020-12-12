const postsResolvers = require("./postsResolvers");
const usersResolvers = require("./usersResolvers");

module.exports = {
  Query: {
    ...postsResolvers.Query,
    ...usersResolvers.Query,
  },
  Mutation: {
    ...postsResolvers.Mutation,
    ...usersResolvers.Mutation,
  },
};
