const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const { SECRET_KEY } = require("../../config");
const { UserInputError } = require("apollo-server");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");

const generateToken = (user) => {
  const { id, username, email } = user;
  return jwt.sign(
    {
      id,
      username,
      email,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

module.exports = {
  Mutation: {
    /**
     *
     *  Connexion d'un utilisateur
     *
     */
    async login(_, { username, password }) {
      // vérification des données entrées
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Login error", { errors });
      }

      // récupération de l'utilisateur
      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "L'utilisateur n'existe pas.";
        throw new UserInputError("L'utilisateur n'existe pas", { errors });
      }

      // vérification du mot de passe
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        errors.general = "Mot de passe incorrect";
        throw new UserInputError("Mot de passe incorrect", { errors });
      }

      // création du token
      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    /**
     *
     *  Création d'un utilisateur
     *
     */
    async register(
      _,
      { registerInput: { username, password, confirmPassword, email } }
    ) {
      // TODO valider les données
      const { valid, errors } = validateRegisterInput(
        username,
        password,
        confirmPassword,
        email
      );

      if (!valid) {
        throw new UserInputError("Input Errors", { errors });
      }
      // vérifie si l'utilisateur existe déjà
      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError("Ce nom est déjà pris!", {
          errors: {
            username: "Ce nom est déjà utilisé!",
          },
        });
      }
      // hash password
      password = await bcrypt.hash(password, 12);

      // création de l'utilisateur
      const newUser = new User({
        username,
        password,
        email,
        createdAt: new Date().toISOString(),
      });

      const result = await newUser.save();

      //  création du token
      const token = generateToken(result);

      return {
        ...result._doc,
        id: result._id,
        token,
      };
    },
  },
};
