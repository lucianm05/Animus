const userUtil = require('../util/userUtil');

exports.get404 = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);

  res.status(404).render('404', {
    pageTitle: 'Pagina nu a fost găsită',
    user: user,
    cart: cart,
  });
};
