const userUtil = require('../util/userUtil');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/Order-Item');
const User = require('../models/User');
const UserAddress = require('../models/User-Address');
const CartItem = require('../models/Cart-Item');

exports.getAddProductPage = (req, res, next) => {
  res.render('admin/add-product.ejs', {
    pageTitle: 'Adăugați un produs',
    errorMessage: req.flash('errorMessage'),
    successMessage: req.flash('successMessage'),
  });
};

exports.postAddProductPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const productName = req.body.name;
  const productImage = req.body.image;
  const productPrice = req.body.price;
  const productDescription = req.body.description;
  const animalCategory = req.body.animalCategory;
  const productType = req.body.productType;

  Product.create({
    name: productName,
    price: productPrice,
    image: productImage,
    description: productDescription,
    animalCategory: animalCategory,
    productType: productType,
    userId: user.id,
  })
    .then((result) => {
      req.flash('successMessage', 'Produsul a fost adăugat.');
      return req.session.save((err) => {
        console.log(err);
        res.redirect('/admin/add-product');
      })
    })
    .catch((error) => console.log(error));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.prodId;

  Product.destroy({ where: { id: prodId } })
    .then((result) => {
      return CartItem.destroy({ where: { productId: prodId } });
    })
    .then((result) => {
      req.flash('successMessage', 'Produsul a fost șters.');
      return req.session.save((err) => {
        console.log(err);
        res.redirect('/');
      })
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getOrdersPage = (req, res, next) => {
  let fetchedOrders = [];

  Order.findAll()
    .then((orders) => {
      return orders.forEach((order) => {
        order.dataValues.createdAt = order.dataValues.createdAt.toString().split(' ').slice(1, 4).join(' ');
        return fetchedOrders.push(order.dataValues);
      });
    })
    .then((result) => {
      res.render('admin/orders.ejs', {
        pageTitle: 'Comenzi',
        orders: fetchedOrders,
      });
    })
    .catch((error) => console.log(error));
};

exports.getOrderDetailsPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const orderId = req.params.orderId;
  const fetchedOrderItems = [];
  let fetchedOrder;
  let totalCartPrice = 0;

  User.findByPk(user.id)
    .then((user) => {
      return Order.findOne({ where: { id: orderId } });
    })
    .then((order) => {
      order.dataValues.createdAt = order.dataValues.createdAt.toString().split(' ').slice(1, 4).join(' ');
      fetchedOrder = order;
      return OrderItem.findAll({ where: { orderId: order.id } });
    })
    .then((orderItems) => {
      return orderItems.forEach((item) => {
        totalCartPrice += item.dataValues.totalPrice;
        item.dataValues.price = item.dataValues.price.toFixed(2);
        item.dataValues.totalPrice = item.dataValues.totalPrice.toFixed(2);
        return fetchedOrderItems.push(item.dataValues);
      });
    })
    .then((order) => {
      return UserAddress.findByPk(fetchedOrder.userAddressId, { paranoid: false });
    })
    .then((userAddress) => {
      res.render('admin/order-detail.ejs', {
        pageTitle: `Comanda #${orderId}`,
        orderItems: fetchedOrderItems,
        totalCartPrice: totalCartPrice.toFixed(2),
        userAddress: userAddress,
        order: fetchedOrder,
      });
    })
    .catch((error) => console.log(error));
};

exports.getOrdersStatusPage = (req, res, next) => {
  const orderStatus = req.params.orderStatus;
  let fetchedOrders = [];

  if (orderStatus === 'sent') {
    return Order.findAll({ where: { sent: true } })
      .then((orders) => {
        return orders.forEach((order) => {
          order.dataValues.createdAt = order.dataValues.createdAt.toString().split(' ').slice(1, 4).join(' ');
          return fetchedOrders.push(order.dataValues);
        });
      })
      .then((result) => {
        res.render('admin/orders.ejs', {
          pageTitle: 'Comenzi',
          orders: fetchedOrders,
        });
      })
      .catch((error) => console.log(error));
  }

  if (orderStatus === 'processing') {
    return Order.findAll({ where: { processing: true } })
      .then((orders) => {
        return orders.forEach((order) => {
          order.dataValues.createdAt = order.dataValues.createdAt.toString().split(' ').slice(1, 4).join(' ');
          return fetchedOrders.push(order.dataValues);
        });
      })
      .then((result) => {
        res.render('admin/orders.ejs', {
          pageTitle: 'Comenzi',
          orders: fetchedOrders,
        });
      })
      .catch((error) => console.log(error));
  }

  if (orderStatus === 'finished') {
    return Order.findAll({ where: { finished: true } })
      .then((orders) => {
        return orders.forEach((order) => {
          order.dataValues.createdAt = order.dataValues.createdAt.toString().split(' ').slice(1, 4).join(' ');
          return fetchedOrders.push(order.dataValues);
        });
      })
      .then((result) => {
        res.render('admin/orders.ejs', {
          pageTitle: 'Comenzi',
          orders: fetchedOrders,
        });
      })
      .catch((error) => console.log(error));
  }

  if (orderStatus === 'cancelled') {
    return Order.findAll({ where: { cancelled: true } })
      .then((orders) => {
        return orders.forEach((order) => {
          order.dataValues.createdAt = order.dataValues.createdAt.toString().split(' ').slice(1, 4).join(' ');
          return fetchedOrders.push(order.dataValues);
        });
      })
      .then((result) => {
        res.render('admin/orders.ejs', {
          pageTitle: 'Comenzi',
          orders: fetchedOrders,
        });
      })
      .catch((error) => console.log(error));
  }
};

exports.postSetOrderSent = (req, res, next) => {
  const orderId = req.body.orderId;
  const url = req.body.url;

  Order.findByPk(orderId)
    .then((order) => {
      return order.update({ sent: true, processing: false, finished: false, cancelled: false });
    })
    .then((result) => {
      res.redirect(url);
    })
    .catch((error) => console.log(error));
};

exports.postSetOrderProcessing = (req, res, next) => {
  const orderId = req.body.orderId;
  const url = req.body.url;

  Order.findByPk(orderId)
    .then((order) => {
      return order.update({ sent: false, processing: true, finished: false, cancelled: false });
    })
    .then((result) => {
      res.redirect(url);
    })
    .catch((error) => console.log(error));
};

exports.postSetOrderFinished = (req, res, next) => {
  const orderId = req.body.orderId;
  const url = req.body.url;

  Order.findByPk(orderId)
    .then((order) => {
      return order.update({ sent: false, processing: false, finished: true, cancelled: false });
    })
    .then((result) => {
      res.redirect(url);
    })
    .catch((error) => console.log(error));
};

exports.postSetOrderCancelled = (req, res, next) => {
  const orderId = req.body.orderId;
  const url = req.body.url;

  Order.findByPk(orderId)
    .then((order) => {
      return order.update({ sent: false, processing: false, finished: false, cancelled: true });
    })
    .then((result) => {
      res.redirect(url);
    })
    .catch((error) => console.log(error));
};
