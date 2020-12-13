const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Mutation: {
    async likePost(_, { postId }, context) {
      const user = checkAuth(context);

      if (!user) {
        throw new AuthenticationError(
          "Vous devez être connecté pour liker un post"
        );
      }

      try {
        const post = await Post.findById(postId);

        if (!post) {
          throw new UserInputError("Post introuvable");
        }

        const likeIndex = post.likes.findIndex(
          (like) => like.username === user.username
        );

        if (likeIndex < 0) {
          post.likes.push({
            username: user.username,
            createdAt: new Date().toISOString(),
          });
        } else {
          post.likes.splice(likeIndex, 1);
        }

        await post.save();

        return post;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
