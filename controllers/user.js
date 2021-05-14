const fetch = require('node-fetch');
const userUtil = require('../util/userUtil');
const User = require('../models/User');
const UserAddress = require('../models/User-Address');

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
  let addresses;

  User.findByPk(user.id)
    .then((user) => {
      UserAddress.findAll({ where: { userId: user.id } })
        .then((result) => {
          addresses = result;
          fetch('https://roloca.coldfuse.io/judete').then((result) => {
            result
              .json()
              .then((states) => {
                res.render('user/user-panel.ejs', {
                  user: user,
                  pageTitle: 'Panoul utilizatorului',
                  cart: cart,
                  states: states,
                  addresses: addresses,
                });
              })
              .catch((error) => console.log(error));
          });
        })
        .catch((error) => console.log(error));
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

exports.postUserAddress = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  let userCountry = '';
  let userState = '';
  let userCity = '';
  let userAddress = '';
  let userZipCode = '';
  let userFullName = '';
  let userPhoneNumber = '';

  if (req.body.country) userCountry = req.body.country;
  if (req.body.state) userState = req.body.state;
  if (req.body.city) userCity = req.body.city;
  if (req.body.address) userAddress = req.body.address;
  if (req.body.zipCode) userZipCode = req.body.zipCode;
  if (req.body.fullName) userFullName = req.body.fullName;
  if (req.body.phoneNumber) userPhoneNumber = req.body.phoneNumber;

  User.findByPk(user.id)
    .then((user) => {
      UserAddress.create({
        country: userCountry,
        state: userState,
        city: userCity,
        address: userAddress,
        zipCode: userZipCode,
        fullName: userFullName,
        phoneNumber: userPhoneNumber,
        userId: user.id,
      });
    })
    .then((result) => {
      res.redirect('/user-panel');
    })
    .catch((error) => console.log(error));

  res.redirect('/user-panel');
};

exports.postDeleteUserAddress = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const userAddressId = req.body.userAddressId;

  User.findByPk(user.id)
    .then((user) => {
      return UserAddress.destroy({ where: { userId: user.id, id: userAddressId } });
    })
    .then((result) => {
      res.redirect('/user-panel');
    })
    .catch((error) => console.log(error));
};

exports.postSetDefaultUserAddress = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const userId = user.id;
  const userAddressId = req.body.userAddressId;

  User.findByPk(user.id)
    .then((user) => {
      return UserAddress.update({ default: false }, { where: { userId: user.id } });
    })
    .then((user) => {
      return UserAddress.update({ default: true }, { where: { userId: userId, id: userAddressId } });
    })
    .then((result) => {
      res.redirect('/user-panel');
    })
    .catch((error) => console.log(error));
};
