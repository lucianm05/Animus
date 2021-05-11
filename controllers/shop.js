const userUtil = require('../util/userUtil');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const CartItem = require('../models/Cart-Item');
const { Op } = require('sequelize');

exports.getIndexPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  let products = [];
  let cart = [];

  // Luăm coșul de cumpărături pentru a determina numărul de produse din coș, care este afișat în navbar
  Cart.findOne({ where: { userId: user.id } })
    .then((cart) => {
      return CartItem.findAll({ where: { cartId: cart.id } });
    })
    .then((cartItems) => {
      cartItems.forEach((item) => {
        cart.push({
          name: item.dataValues.name,
        });

        return cart;
      });
    })
    .then((result) => {
      Product.findAll()
        .then((result) => {
          return (products = result);
        })
        .then((result) => {
          res.render('shop/index.ejs', {
            pageTitle: 'Animus',
            user: user,
            products: products,
            cart: cart,
          });
        })
        .catch((error) => console.log(error));
    });
};

exports.getAnimalCategoryPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const animalCategory = req.params.category;
  const title = animalCategory.charAt(0).toUpperCase() + animalCategory.slice(1);
  let products = [];
  let cart = [];

  // Luăm coșul de cumpărături pentru a determina numărul de produse din coș, care este afișat în navbar
  Cart.findOne({ where: { userId: user.id } })
    .then((cart) => {
      return CartItem.findAll({ where: { cartId: cart.id } });
    })
    .then((cartItems) => {
      cartItems.forEach((item) => {
        cart.push({
          name: item.dataValues.name,
        });

        return cart;
      });
    })
    .then((result) => {
      Product.findAll({ where: { animalCategory: animalCategory } })
        .then((result) => {
          return (products = result);
        })
        .then((result) => {
          res.render('shop/index.ejs', {
            pageTitle: title,
            user: user,
            products: products,
            cart: cart,
          });
        })
        .catch((error) => console.log(error));
    });
};

exports.getSearch = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const searchParams = req.body.searchParams.split(' ');
  let cart = [];

  // Luăm coșul de cumpărături pentru a determina numărul de produse din coș, care este afișat în navbar
  Cart.findOne({ where: { userId: user.id } })
    .then((cart) => {
      return CartItem.findAll({ where: { cartId: cart.id } });
    })
    .then((cartItems) => {
      cartItems.forEach((item) => {
        cart.push({
          name: item.dataValues.name,
        });

        return cart;
      });
    })
    .then((result) => {
      Product.findAll({ where: { name: { [Op.like]: '%' + searchParams[0] + '%' } } })
        .then((result) => {
          res.render('shop/index.ejs', {
            pageTitle: 'Rezultatele căutării',
            user: user,
            products: result,
            cart: cart,
          });
        })
        .catch((error) => console.log(error));
    });
};
