const userUtil = require('../util/userUtil');
const User = require('../models/User');
const Cart = require('../models/Cart');
const CartItem = require('../models/Cart-Item');

exports.getSignUpPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);

  res.render('user/sign-up.ejs', {
    pageTitle: 'Înregistrare',
    user: user,
    cart: cart,
  });
};

exports.getSignInPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);

  res.render('user/sign-in.ejs', {
    pageTitle: 'Autentificare',
    user: user,
    cart: cart,
  });
};

exports.postSignUpPage = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  User.create({
    name: username,
    email: email,
    password: password,
  })
    .then((result) => {
      res.redirect('/');
    })
    .catch((error) => console.log(error));
};

exports.postSignInPage = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    where: {
      email: email,
      password: password,
    },
  })
    .then((user) => {
      req.user = user;
    })
    .then((result) => {
      res.redirect('/');
    })
    .catch((error) => console.log(error));
};

exports.getUserPanelPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);

  User.findByPk(user.id)
    .then((user) => {
      res.render('user/user-panel.ejs', {
        user: user,
        pageTitle: 'Panoul utilizatorului',
        cart: cart,
      });
    })
    .catch((error) => console.log(error));
};

exports.postEditUsername = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const newUsername = req.body.name;

  User.findByPk(user.id)
    .then((user) => {
      if (user.name !== newUsername) {
        user.update({ name: newUsername });
      }
    })
    .then((result) => {
      res.redirect('/user-panel');
    })
    .catch((error) => console.log(error));
};

exports.postEditEmail = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const newEmail = req.body.email;

  User.findByPk(user.id)
    .then((user) => {
      if (user.email !== newEmail) {
        user.update({ email: newEmail });
      }
    })
    .then((result) => {
      res.redirect('/user-panel');
    })
    .catch((error) => console.log(error));
};

exports.postEditPassword = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const newPassword = req.body.password;

  User.findByPk(user.id)
    .then((user) => {
      if (user.password !== newPassword) {
        user.update({ password: newPassword });
      }
    })
    .then((result) => {
      res.redirect('/user-panel');
    })
    .catch((error) => console.log(error));
};
