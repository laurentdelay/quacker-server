module.exports.validateRegisterInput = (
  username,
  password,
  confirmPassword,
  email
) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Vous devez entrer un nom d'utilisateur.";
  }

  if (email.trim() === "") {
    errors.email = "Vous devez entrer une adresse email.";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]?[0-9a-zA-Z])*)@([0-9a-zA-Z]([-.\w]?[0-9a-zA-Z])*)\.([a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "L'adresse email n'est pas valide.";
    }
  }

  if (password === "") {
    errors.password = "Vous devez entrer un mot de passe.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};

  if (username.trim() === "") {
    errors.username = "Vous devez entrer un nom d'utilisateur.";
  }

  if (password === "") {
    errors.password = "Vous devez entrer un mot de passe.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
