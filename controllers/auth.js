const userUtil = require('../util/userUtil');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getSignUpPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);

  res.render('auth/sign-up.ejs', {
    pageTitle: 'Înregistrare',
    user: user,
    cart: cart,
  });
};

exports.getSignInPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);

  res.render('auth/sign-in.ejs', {
    pageTitle: 'Autentificare',
    user: user,
    cart: cart,
  });
};

exports.postSignUp = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        return res.redirect('/sign-up');
      } else {
        return bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            return User.create({
              name: username,
              email: email,
              password: hashedPassword,
            });
          })
          .then((result) => {
            if (result) {
              res.redirect('/sign-in');
            }
          });
      }
    })
    .catch((error) => console.log(error));
};

exports.postSignIn = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return res.redirect('/sign-up');
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.loggedId = true;
            req.session.userId = user.id;
            return req.session.save((err) => {
              console.log(err);
              res.status(200).redirect('/');
            });
          }

          res.redirect('/sign-in');
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
