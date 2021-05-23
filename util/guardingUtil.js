const userUtil = require('./userUtil');

exports.isLoggedIn = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);

  if (!req.session.loggedId) {
    return res.render('notAuth.ejs', {
      pageTitle: 'Nu sunteți autentificat!',
      cart: cart,
      user: user,
    });
  }

  return next();
};

exports.isAdmin = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);

  if (req.session.userId) {
    if (!req.user.admin) {
      return res.render('404.ejs', {
        pageTitle: 'Nu sunteți administrator!',
        cart: cart,
        user: user,
      });
    }
  }

  return next();
};
