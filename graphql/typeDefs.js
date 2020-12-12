const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    token: String!
    createdAt: String!
  }
  input registerInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    # posts queries
    getPosts: [Post]
    getPost(postId: ID!): Post

    # users queries
    login(username: String!, password: String!): User!
  }
  type Mutation {
    # posts mutations
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!

    # users mutations
    register(registerInput: registerInput): User!
  }
`;
