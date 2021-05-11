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
          res.render('shop/product-category.ejs', {
            pageTitle: title,
            user: user,
            products: products,
            cart: cart,
            animalCategory: animalCategory,
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
      res.render('shop/cart.ejs', {
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
  const url = req.body.url;
  let loggedIn = false;
  const prodId = req.body.prodId;
  const prodName = req.body.prodName;
  const prodImage = req.body.prodImage;
  const prodPrice = req.body.prodPrice;
  let fetchedCart;
  let newQuantity = 1;
  let newPrice = prodPrice;
  console.log(req.query);
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
  const productId = req.params.prodId;
  console.log(productId);
  let cart = [];

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
      Product.findByPk(productId)
        .then((product) => {
          res.render('shop/product-detail.ejs', {
            pageTitle: product.name,
            user: user,
            cart: cart,
            product: product,
          });
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};
