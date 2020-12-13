const postsResolvers = require("./postsResolvers");
const commentsResolvers = require("./commentsResolvers");
const usersResolvers = require("./usersResolvers");
const likesResolvers = require("./likesResolvers");

module.exports = {
  Post: { ...postsResolvers.Post },
  Query: {
    ...postsResolvers.Query,
    ...usersResolvers.Query,
  },
  Mutation: {
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...likesResolvers.Mutation,
    ...usersResolvers.Mutation,
  },
};
