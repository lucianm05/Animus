const fetch = require('node-fetch');
const userUtil = require('../util/userUtil');
const User = require('../models/User');
const UserAddress = require('../models/User-Address');
const Order = require('../models/Order');
const OrderItem = require('../models/Order-Item');

exports.getUserPanelPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);
  let addresses;

  if (!user.name) {
    return res.render('notAuth.ejs', {
      pageTitle: 'Nu sunteți autentificat',
      user: user,
      cart: cart,
    });
  }

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

exports.getUserOrdersPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);
  let fetchedOrders = [];

  if (!user.name) {
    return res.render('notAuth.ejs', {
      pageTitle: 'Nu sunteți autentificat',
      user: user,
      cart: cart,
    });
  }

  User.findByPk(user.id)
    .then((user) => {
      return Order.findAll({ where: { userId: user.id } });
    })
    .then((orders) => {
      return orders.forEach((order) => {
        order.dataValues.createdAt = order.dataValues.createdAt.toString().split(' ').slice(1, 4).join(' ');
        return fetchedOrders.push(order.dataValues);
      });
    })
    .then((result) => {
      res.render('user/orders.ejs', {
        pageTitle: 'Comenzile tale',
        user: user,
        cart: cart,
        orders: fetchedOrders,
      });
    })
    .catch((error) => console.log(error));
};

exports.getOrderDetailsPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);
  const orderId = req.params.orderId;
  const fetchedOrderItems = [];
  let fetchedOrder;
  let totalCartPrice = 0;

  if (!user.name) {
    return res.render('notAuth.ejs', {
      pageTitle: 'Nu sunteți autentificat',
      user: user,
      cart: cart,
    });
  }

  User.findByPk(user.id)
    .then((user) => {
      return Order.findOne({ where: { id: orderId, userId: user.id } });
    })
    .then((order) => {
      if (!order) {
        return res.render('404.ejs', {
          pageTitle: 'Pagina nu a fost găsită',
          user: user,
          cart: cart,
        });
      }
      order.dataValues.createdAt = order.dataValues.createdAt.toString().split(' ').slice(1, 4).join(' ');
      fetchedOrder = order;
      return OrderItem.findAll({ where: { orderId: order.id } });
    })
    .then((orderItems) => {
      if(orderItems) {
        return orderItems.forEach((item) => {
          totalCartPrice += item.dataValues.totalPrice;
          item.dataValues.price = item.dataValues.price.toFixed(2);
          item.dataValues.totalPrice = item.dataValues.totalPrice.toFixed(2);
          return fetchedOrderItems.push(item.dataValues);
        });
      }
    })
    .then((order) => {
      return UserAddress.findByPk(fetchedOrder.userAddressId);
    })
    .then((userAddress) => {
      res.render('user/order-detail.ejs', {
        pageTitle: `Comanda #${orderId}`,
        user: user,
        cart: cart,
        orderItems: fetchedOrderItems,
        totalCartPrice: totalCartPrice.toFixed(2),
        userAddress: userAddress,
        order: fetchedOrder,
      });
    })
    .catch((error) => console.log(error));
};

exports.postCancelUserOrder = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
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
