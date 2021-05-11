const userUtil = require('../util/userUtil');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const CartItem = require('../models/Cart-Item');

exports.getSignUpPage = (req, res, next) => {
  res.render('user/sign-up.ejs', {
    pageTitle: 'Înregistrare',
    user: req.user,
  });
};

exports.getSignInPage = (req, res, next) => {
  res.render('user/sign-in.ejs', {
    pageTitle: 'Autentificare',
    user: req.user,
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

exports.getCartPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  let loggedIn = false;
  let cart = [];
  let totalCartPrice = 0;

  if (user.name) {
    loggedIn = true;
  }

  if (!loggedIn) {
    return res.render('notAuth.ejs', {
      pageTitle: 'Nu sunteți autentificat!',
      user: user,
    });
  }

  Cart.findOne({ where: { userId: user.id } })
    .then((cart) => {
      return CartItem.findAll({ where: { cartId: cart.id } });
    })
    .then((cartItems) => {
      cartItems.forEach((item) => {
        totalCartPrice = totalCartPrice + +item.dataValues.totalPrice;
        cart.push({
          name: item.dataValues.name,
          quantity: item.dataValues.quantity,
          price: item.dataValues.price.toFixed(2),
          image: item.dataValues.image,
          totalPrice: item.dataValues.totalPrice,
          prodId: item.dataValues.productId,
        });

        return cart;
      });
    })
    .then((result) => {
      res.render('user/cart.ejs', {
        pageTitle: 'Coș',
        cart: cart,
        user: user,
        totalCartPrice: totalCartPrice.toFixed(2),
      });
    })
    .catch((error) => console.log(error));
};

exports.postAddToCart = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  let loggedIn = false;
  const prodId = req.body.prodId;
  const prodName = req.body.prodName;
  const prodImage = req.body.prodImage;
  const prodPrice = req.body.prodPrice;
  let fetchedCart;
  let newQuantity = 1;
  let newPrice = prodPrice;

  if (user.name) {
    loggedIn = true;
  }

  if (!loggedIn) {
    return res.render('notAuth.ejs', {
      pageTitle: 'Nu sunteți autentificat!',
      user: user,
    });
  }

  Cart.findOne({ where: { userId: user.id } })
    .then((cart) => {
      fetchedCart = cart;
      return CartItem.findOne({ where: { productId: prodId, cartId: cart.id } });
    })
    .then((product) => {
      if (!product) {
        return CartItem.create({ productId: prodId, name: prodName, image: prodImage, price: prodPrice, totalPrice: prodPrice * newQuantity, cartId: fetchedCart.id, quantity: newQuantity });
      }

      if (product) {
        const oldQuantity = product.quantity;
        newQuantity = oldQuantity + 1;
        newPrice = prodPrice * newQuantity;
        return CartItem.update({ quantity: newQuantity, totalPrice: newPrice.toFixed(2) }, { where: { productId: prodId, cartId: fetchedCart.id } });
      }
    })
    .then((result) => {
      res.redirect('/');
    })
    .catch((error) => console.log(error));
};

exports.postRemoveFromCart = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  let loggedIn = false;
  const prodId = req.body.prodId;
  console.log(prodId);

  if (user.name) {
    loggedIn = true;
  }

  if (!loggedIn) {
    return res.render('notAuth.ejs', {
      pageTitle: 'Nu sunteți autentificat!',
      user: user,
    });
  }

  Cart.findOne({ where: { userId: user.id } })
    .then((cart) => {
      return CartItem.destroy({ where: { productId: prodId, cartId: cart.id } });
    })
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((error) => console.log(error));
};

exports.postIncreaseCartQuantity = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  let loggedIn = false;
  const prodId = req.body.prodId;
  let newQuantity = 0;
  let newPrice = 0;

  if (user.name) {
    loggedIn = true;
  }

  if (!loggedIn) {
    return res.render('notAuth.ejs', {
      pageTitle: 'Nu sunteți autentificat!',
      user: user,
    });
  }

  Cart.findOne({ where: { userId: user.id } })
    .then((cart) => {
      return CartItem.findOne({ where: { cartId: cart.id, productId: prodId } });
    })
    .then((product) => {
      const oldQuantity = product.quantity;
      const oldTotalPrice = product.totalPrice;
      newQuantity = oldQuantity + 1;
      newPrice = oldTotalPrice + product.price;
      return product.update({ quantity: newQuantity, totalPrice: newPrice.toFixed(2) });
    })
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((error) => console.log(error));
};
