const { AuthenticationError, UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Post: {
    commentsCount: (parent) => parent.comments.length,
    likesCount: (parent) => parent.likes.length,
  },
  Query: {
    // récupération de l'ensemble des posts
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });

        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },

    // récupération d'un unique post
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);

        if (post) {
          return post;
        } else {
          throw new Error("Post introuvable.");
        }
      } catch (error) {
        if (error.kind === "ObjectId") {
          throw new Error("Post introuvable");
        } else {
          throw new Error(error);
        }
      }
    },
  },
  Mutation: {
    // creation d'un post
    async createPost(_, { body }, context) {
      // vérification qu'un utilisateur est connecté
      const user = checkAuth(context);
      if (!user) {
        throw new AuthenticationError(
          "Vous devez être connecté pour créer un post."
        );
      }

      if (body.trim() === "") {
        throw new UserInputError("Post vide", {
          errors: {
            body: "Le post ne peux pas être vide.",
          },
        });
      }

      if (body.length > 256) {
        throw new UserInputError("Post vide", {
          errors: {
            body: "Le post ne peux pas contenir plus de 256 caractères.",
          },
        });
      }

      const newPost = new Post({
        body,
        username: user.username,
        user: user.id,
        createdAt: new Date().toISOString(),
      });

      try {
        const post = await newPost.save();

        return post;
      } catch (error) {
        throw new Error(error);
      }
    },

    // suppression d'un post
    async deletePost(_, { postId }, context) {
      // vérification qu'un utilisateur est connecté
      const user = checkAuth(context);

      if (user) {
        try {
          // récupération du post sélectionné
          const post = await Post.findById(postId);
          if (!post) {
            throw new Error("Post introuvable.");
          }

          if (post.username === user.username) {
            await post.delete();

            return "Post supprimé avec succès.";
          } else {
            throw new AuthenticationError(
              "Vous n'avez pas la permission de faire ceci."
            );
          }
        } catch (error) {
          if (error.kind === "ObjectId") {
            throw new Error("Post introuvable");
          } else {
            throw new Error(error);
          }
        }
      } else {
        throw new AuthenticationError(
          "Vous devez être connecté pour supprimer ce post."
        );
      }
    },
  },
};
