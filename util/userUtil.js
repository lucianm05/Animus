exports.returnUser = (req, res, next) => {
  let user = {
    name: null,
    email: null,
    password: null,
  };

  if (req.user) {
    return user = req.user;
  }

  return user;
}