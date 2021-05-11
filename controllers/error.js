const userUtil = require('../util/userUtil');

exports.get404 = (req, res, next) => {
  const user = userUtil.returnUser();

  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    user: user,
  });
};
