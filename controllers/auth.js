const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { validationResult } = require('express-validator/check');

exports.getSignUpPage = (req, res, next) => {
  res.render('auth/sign-up.ejs', {
    pageTitle: 'Înregistrare',
    errorMessage: req.flash('errorMessage'),
    successMessage: req.flash('successMessage'),
    oldInput: {
      username: '',
      email: '',
      password: '',
    },
    validationErrors: [],
  });
};

exports.getSignInPage = (req, res, next) => {
  res.render('auth/sign-in.ejs', {
    pageTitle: 'Autentificare',
    errorMessage: req.flash('errorMessage'),
    successMessage: req.flash('successMessage'),
    oldInput: {
      username: '',
      email: '',
      password: '',
    },
    validationErrors: [],
  });
};

exports.postSignUp = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  const errorMessages = [];

  if (!errors.isEmpty()) {
    errors.array().forEach((err) => {
      errorMessages.push(err.msg);
    });

    return res.render('auth/sign-up.ejs', {
      pageTitle: 'Înregistrare',
      errorMessage: errorMessages.join('\n'),
      successMessage: req.flash('successMessage'),
      oldInput: {
        username: username,
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        req.flash('errorMessage', 'Există deja un utilizator cu această adresă de email.');
        return req.session.save((error) => {
          console.log(error);
          res.redirect('/sign-up');
        });
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
              req.flash('successMessage', 'Utilizatorul a fost înregistrat cu succes! Vă puteți autentifica.');
              return req.session.save((error) => {
                console.log(error);
                res.redirect('/sign-in');
              });
            }
          });
      }
    })
    .catch((error) => console.log(error));
};

exports.postSignIn = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  const errorMessages = [];

  if (!errors.isEmpty()) {
    errors.array().forEach((err) => {
      errorMessages.push(err.msg);
    });

    return res.render('auth/sign-in.ejs', {
      pageTitle: 'Autentificare',
      errorMessage: errorMessages.join('\n'),
      successMessage: req.flash('successMessage'),
      oldInput: {
        username: '',
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        req.flash('errorMessage', 'Nu există niciun utilizator cu această adresă de email.');
        return req.session.save((error) => {
          console.log(error);
          res.redirect('/sign-in');
        });
      } else {
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
            req.flash('errorMessage', 'Parola introdusă este greșită.');
            return req.session.save((error) => {
              console.log(error);
              res.redirect('/sign-in');
            });
          })
          .catch((error) => console.log(error));
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postSignInTestUser = (req, res, next) => {
  User.findOne({ where: { testUser: true } })
    .then(user => {
      if (!user) {
        req.flash('errorMessage', 'Utilizatorul nu a fost găsit.');
        return req.session.save((error) => {
          console.log(error);
          res.redirect('/sign-in');
        });
      } else {
        req.session.loggedId = true;
        req.session.userId = user.id;
        return req.session.save((err) => {
          console.log(err);
          res.status(200).redirect('/');
        });
      }
    })
    .catch((error) => console.log(error));
};

exports.postLogout = (req, res, next) => {
  return req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
