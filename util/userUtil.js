const Cart = require('../models/Cart');
const CartItem = require('../models/Cart-Item');

exports.returnUser = (req, res, next) => {
  let user = {
    name: null,
    email: null,
    password: null,
  };

  if (req.user) {
    return (user = req.user);
  }

  return user;
};

exports.returnCart = (req, res, next) => {
  let cart = [];

  if(req.user) {
    cart = req.cart;
  }

  return cart;
};
