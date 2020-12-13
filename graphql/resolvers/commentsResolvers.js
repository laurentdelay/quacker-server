const { AuthenticationError, UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Mutation: {
    async addComment(_, { postId, body }, context) {
      const user = checkAuth(context);

      if (!user) {
        throw new AuthenticationError(
          "Vous devez être connecté pour commenter."
        );
      }

      if (body.trim() === "") {
        throw new UserInputError("Commentaire vide", {
          errors: {
            body: "Le commentaire ne peux pas être vide.",
          },
        });
      }

      try {
        const post = await Post.findById(postId);

        if (!post) {
          throw new UserInputError("Post introuvable");
        }

        post.comments.unshift({
          body,
          username: user.username,
          createdAt: new Date().toISOString(),
        });

        await post.save();
        return post;
      } catch (error) {
        throw new Error(error);
      }
    },

    async deleteComment(_, { postId, commentId }, context) {
      const user = checkAuth(context);

      if (!user) {
        throw new AuthenticationError(
          "Vous devez être connecté pour supprimer un commentaire."
        );
      }

      try {
        const post = await Post.findById(postId);

        if (!post) {
          throw new UserInputError("Post introuvable");
        }

        const commentIndex = post.comments.findIndex(
          (comment) => comment.id === commentId
        );

        if (commentIndex < 0) {
          throw new UserInputError("Commentaire introuvable.");
        }

        if (post.comments[commentIndex].username !== user.username) {
          throw new AuthenticationError(
            "Vous n'avez pas la permission de faire ceci."
          );
        }

        post.comments.splice(commentIndex, 1);

        await post.save();
        return post;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
