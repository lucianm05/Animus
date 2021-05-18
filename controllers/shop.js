const userUtil = require('../util/userUtil');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const CartItem = require('../models/Cart-Item');
const Review = require('../models/Review');
const User = require('../models/User');
const UserAddress = require('../models/User-Address');
const Order = require('../models/Order');
const OrderItem = require('../models/Order-Item');
const { Op } = require('sequelize');

exports.getIndexPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);
  let products = [];

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
};

exports.getAnimalCategoryPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);
  const animalCategory = req.params.category;
  const title = animalCategory.charAt(0).toUpperCase() + animalCategory.slice(1);
  let products = [];

  Product.findAll({ where: { animalCategory: animalCategory } })
    .then((result) => {
      return (products = result);
    })
    .then((result) => {
      res.render('shop/product-category.ejs', {
        pageTitle: title,
        user: user,
        products: products,
        cart: cart,
        animalCategory: animalCategory,
      });
    })
    .catch((error) => console.log(error));
};

exports.getSearch = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);
  const searchParams = req.body.searchParams.split(' ');

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
};

exports.getCartPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  let cart = [];
  let loggedIn = false;
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
          totalPrice: item.dataValues.totalPrice.toFixed(2),
          prodId: item.dataValues.productId,
        });

        return cart;
      });
    })
    .then((result) => {
      return UserAddress.findAll({ where: { userId: user.id } });
    })
    .then((addresses) => {
      res.render('shop/cart.ejs', {
        pageTitle: 'Coș',
        cart: cart,
        user: user,
        totalCartPrice: totalCartPrice.toFixed(2),
        addresses: addresses,
      });
    })
    .catch((error) => console.log(error));
};

exports.postAddToCart = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const url = req.body.url;
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
      return CartItem.findOne({ where: { productId: prodId, cartId: cart.id, userId: user.id } });
    })
    .then((product) => {
      if (!product) {
        return CartItem.create({ productId: prodId, userId: user.id, name: prodName, image: prodImage, price: prodPrice, totalPrice: prodPrice * newQuantity, cartId: fetchedCart.id, quantity: newQuantity });
      }

      if (product) {
        const oldQuantity = product.quantity;
        newQuantity = oldQuantity + 1;
        newPrice = prodPrice * newQuantity;
        return CartItem.update({ quantity: newQuantity, totalPrice: newPrice.toFixed(2) }, { where: { productId: prodId, userId: user.id, cartId: fetchedCart.id } });
      }
    })
    .then((result) => {
      res.redirect(url);
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

exports.getProductDetailPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);
  const productId = req.params.prodId;
  const reviews = [];
  let prod;
  let rating = 0;

  Product.findByPk(productId)
    .then((product) => {
      prod = product;
      return Review.findAll({ where: { productId: product.id }, include: User });
    })
    .then((result) => {
      result.forEach((review) => {
        rating += review.dataValues.rating;
        review.dataValues.createdAt = review.dataValues.createdAt.toString().split(' ').slice(1, 4).join(' ');
        reviews.push({
          ...review.dataValues,
          username: review.user.dataValues.name,
        });
      });
      return reviews;
    })
    .then((result) => {
      res.render('shop/product-detail.ejs', {
        pageTitle: 'Animus',
        user: user,
        cart: cart,
        product: prod,
        reviews: reviews,
        rating: (rating / reviews.length).toFixed(2),
      });
    })
    .catch((error) => console.log(error));
};

exports.postAddReview = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const url = req.body.url;
  const prodId = req.body.prodId;
  const prodReview = req.body.prodReview;
  const prodRating = req.body.rating;

  User.findByPk(user.id)
    .then((user) => {
      return Review.create({
        comment: prodReview,
        rating: prodRating,
        userId: user.id,
        productId: prodId,
      });
    })
    .then((result) => {
      res.redirect(url);
    })
    .catch((error) => console.log(error));
};

exports.getOrderPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);
  const userAddressId = req.params.userAddressId;
  let totalCartPrice = 0;

  if (!user.name) {
    res.render('notAuth.ejs', {
      pageTitle: 'Nu sunteți autentificat!',
      user: user,
      cart: cart,
    });
  }

  if (cart.length <= 0) {
    res.render('404.ejs', {
      pageTitle: 'Coșul de cumpărături este gol',
      user: user,
      cart: cart,
    });
  }

  User.findByPk(user.id)
    .then((user) => {
      return cart.forEach((item) => {
        totalCartPrice += item.dataValues.totalPrice;
      });
    })
    .then((cart) => {
      return UserAddress.findOne({ where: { id: userAddressId, userId: user.id } });
    })
    .then((address) => {
      res.render('shop/send-order.ejs', {
        pageTitle: 'Finalizează comanda',
        user: user,
        address: address,
        totalCartPrice: totalCartPrice.toFixed(2),
        cart: cart,
      });
    })
    .catch((error) => console.log(error));
};

exports.postFinishOrder = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);
  const userAddressId = req.body.userAddressId;
  const deliveryMethod = req.body.deliveryMethod;
  const payMethod = req.body.payMethod;

  if (!user.name) {
    res.render('notAuth.ejs', {
      pageTitle: 'Nu sunteți autentificat!',
      user: user,
      cart: cart,
    });
  }

  if (cart.length <= 0) {
    res.render('404.ejs', {
      pageTitle: 'Coșul de cumpărături este gol',
      user: user,
      cart: cart,
    });
  }

  User.findByPk(user.id)
    .then((user) => {
      return Order.create({
        sent: true,
        processing: false,
        finished: false,
        cancelled: false,
        deliveryMethod: deliveryMethod,
        payMethod: payMethod,
        userId: user.id,
        cartId: cart[0].cartId,
        userAddressId: userAddressId,
      });
    })
    .then((order) => {
      return cart.forEach((item) => {
        OrderItem.create({
          productId: item.dataValues.productId,
          quantity: item.dataValues.quantity,
          price: item.dataValues.price,
          totalPrice: item.dataValues.totalPrice,
          name: item.dataValues.name,
          orderId: order.id,
        });
      });
    })
    .then((result) => {
      return CartItem.destroy({ where: { cartId: cart[0].cartId, userId: user.id } })
    })
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((error) => console.log(error));
};
