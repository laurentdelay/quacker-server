const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
    commentsCount: Int!
    likesCount: Int!
  }
  type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }
  type Like {
    id: ID!
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
  }
  type Mutation {
    # posts mutations
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!

    # comments mutations
    addComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!

    # likes mutations
    likePost(postId: ID!): Post!

    # users mutations
    login(username: String!, password: String!): User!
    register(registerInput: registerInput): User!
  }
`;
