const fetch = require('node-fetch');
const userUtil = require('../util/userUtil');
const User = require('../models/User');
const UserAddress = require('../models/User-Address');
const Order = require('../models/Order');
const OrderItem = require('../models/Order-Item');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

exports.getUserPanelPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  let addresses;

  User.findByPk(user.id)
    .then((user) => {
      UserAddress.findAll({ where: { userId: user.id } })
        .then((userAddresses) => {
          addresses = userAddresses;
          fetch('https://roloca.coldfuse.io/judete').then((result) => {
            result
              .json()
              .then((states) => {
                res.render('user/user-panel.ejs', {
                  pageTitle: 'Panoul utilizatorului',
                  states: states,
                  addresses: addresses,
                  errorMessage: req.flash('errorMessage'),
                  successMessage: req.flash('successMessage'),
                  validationErrors: req.flash('validationErrors'),
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
  const errors = validationResult(req);
  const errorMessages = [];

  if (!errors.isEmpty()) {
    errors.array().forEach((err) => {
      errorMessages.push(err.msg);
    });

    req.flash('validationErrors', errors.array());
    req.flash('errorMessage', errorMessages.join('\n'));
    return req.session.save((err) => {
      console.log(err);
      res.redirect('/user-panel');
    });
  }

  const user = userUtil.returnUser(req, res, next);
  const newUsername = req.body.name;
  const currentPassword = req.body.currentPassword;

  User.findByPk(user.id)
    .then((user) => {
      if (user.name !== newUsername) {
        bcrypt.compare(currentPassword, user.password).then((doMatch) => {
          if (doMatch) {
            user.update({ name: newUsername });
            req.flash('successMessage', 'Numele de utilizator a fost schimbat cu succes.');
            return req.session.save((error) => {
              console.log(error);
              res.redirect('/user-panel');
            });
          } else {
            req.flash('errorMessage', 'Parola introdusă nu corespunde cu cea actuală.');
            return req.session.save((error) => {
              console.log(error);
              res.redirect('/user-panel');
            });
          }
        });
      } else {
        req.flash('errorMessage', 'Numele de utilizator nu poate fi egal cu cel vechi.');
        return req.session.save((error) => {
          console.log(error);
          res.redirect('/user-panel');
        });
      }
    })
    .catch((error) => console.log(error));
};

exports.postEditEmail = (req, res, next) => {
  const errors = validationResult(req);
  const errorMessages = [];

  if (!errors.isEmpty()) {
    errors.array().forEach((err) => {
      errorMessages.push(err.msg);
    });

    req.flash('validationErrors', errors.array());
    req.flash('errorMessage', errorMessages.join('\n'));
    return req.session.save((err) => {
      console.log(err);
      res.redirect('/user-panel');
    });
  }

  const user = userUtil.returnUser(req, res, next);
  const newEmail = req.body.email;
  const currentPassword = req.body.currentPassword;

  User.findOne({ where: { email: newEmail } })
    .then((existingUser) => {
      if (existingUser) {
        req.flash('errorMessage', 'Adresa de email este deja folosită.');
        return req.session.save((err) => {
          console.log(err);
          res.redirect('/user-panel');
        });
      } else {
        User.findByPk(user.id).then((user) => {
          if (user.email !== newEmail) {
            bcrypt.compare(currentPassword, user.password).then((doMatch) => {
              if (doMatch) {
                user.update({ email: newEmail });
                req.flash('successMessage', 'Adresa de email a fost schimbată cu succes.');
                return req.session.save((error) => {
                  console.log(error);
                  res.redirect('/user-panel');
                });
              } else {
                req.flash('errorMessage', 'Parola introdusă nu corespunde cu cea actuală.');
                return req.session.save((error) => {
                  console.log(error);
                  res.redirect('/user-panel');
                });
              }
            });
          } else {
            req.flash('errorMessage', 'Adresa de email nu poate fi egală cu cea veche.');
            return req.session.save((error) => {
              console.log(error);
              res.redirect('/user-panel');
            });
          }
        });
      }
    })
    .catch((error) => console.log(error));
};

exports.postEditPassword = (req, res, next) => {
  const errors = validationResult(req);
  const errorMessages = [];

  if (!errors.isEmpty()) {
    errors.array().forEach((err) => {
      errorMessages.push(err.msg);
    });

    req.flash('validationErrors', errors.array());
    req.flash('errorMessage', errorMessages.join('\n'));
    return req.session.save((err) => {
      console.log(err);
      res.redirect('/user-panel');
    });
  }

  const user = userUtil.returnUser(req, res, next);
  const newPassword = req.body.password;
  const currentPassword = req.body.currentPassword;

  User.findByPk(user.id)
    .then((user) => {
      bcrypt.compare(newPassword, user.password).then((doMatch) => {
        if (doMatch) {
          req.flash('errorMessage', 'Parola nouă nu poate fi egală cu cea veche.');
          return req.session.save((error) => {
            console.log(error);
            res.redirect('/user-panel');
          });
        } else {
          bcrypt.compare(currentPassword, user.password).then((doMatch) => {
            if (doMatch) {
              bcrypt.hash(newPassword, 12).then((hashedPassword) => {
                user.update({ password: hashedPassword });
                req.flash('successMessage', 'Parola a fost schimbată.');
                return req.session.save((error) => {
                  console.log(error);
                  res.redirect('/user-panel');
                });
              });
            } else {
              req.flash('errorMessage', 'Parola introdusă nu corespunde cu cea actuală.');
              return req.session.save((error) => {
                console.log(error);
                res.redirect('/user-panel');
              });
            }
          });
        }
      });
    })
    .catch((error) => console.log(error));
};

exports.postUserAddress = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const url = req.body.url;
  const errors = validationResult(req);
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

  if (!errors.isEmpty()) {
    req.flash('errorMessage', errors.array()[0].msg);
    return req.session.save((err) => {
      console.log(err);
      res.redirect('/user-panel');
    });
  }

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
      }).then((result) => {
        req.flash('successMessage', 'Adresa a fost adăugată cu succes.');
        return req.session.save((err) => {
          console.log(err);
          res.redirect(url);
        });
      });
    })
    .catch((error) => console.log(error));
};

exports.postDeleteUserAddress = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const userAddressId = req.body.userAddressId;

  User.findByPk(user.id)
    .then((user) => {
      return UserAddress.destroy({ where: { userId: user.id, id: userAddressId } });
    })
    .then((result) => {
      req.flash('successMessage', 'Adresa a fost ștearsă.');
      return req.session.save((err) => {
        console.log(err);
        res.redirect('/user-panel');
      });
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
      req.flash('successMessage', 'Adresa a fost setată principală.');
      return req.session.save((err) => {
        console.log(err);
        res.redirect('/user-panel');
      });
    })
    .catch((error) => console.log(error));
};

exports.getUserOrdersPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  let fetchedOrders = [];

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
      return Order.findOne({ where: { id: orderId, userId: user.id } });
    })
    .then((order) => {
      if (!order) {
        return res.render('404.ejs', {
          pageTitle: 'Pagina nu a fost găsită',
        });
      }
      order.dataValues.createdAt = order.dataValues.createdAt.toString().split(' ').slice(1, 4).join(' ');
      fetchedOrder = order;
      return OrderItem.findAll({ where: { orderId: order.id } });
    })
    .then((orderItems) => {
      if (orderItems) {
        return orderItems.forEach((item) => {
          totalCartPrice += item.dataValues.totalPrice;
          item.dataValues.price = item.dataValues.price.toFixed(2);
          item.dataValues.totalPrice = item.dataValues.totalPrice.toFixed(2);
          return fetchedOrderItems.push(item.dataValues);
        });
      }
    })
    .then((order) => {
      return UserAddress.findByPk(fetchedOrder.userAddressId, { paranoid: false });
    })
    .then((userAddress) => {
      res.render('user/order-detail.ejs', {
        pageTitle: `Comanda #${orderId}`,
        orderItems: fetchedOrderItems,
        totalCartPrice: totalCartPrice.toFixed(2),
        userAddress: userAddress,
        order: fetchedOrder,
      });
    })
    .catch((error) => console.log(error));
};

exports.postCancelUserOrder = (req, res, next) => {
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

