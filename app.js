const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();

const csrfProtection = csrf();

const errorController = require('./controllers/error');
const shopRoutes = require('./routes/shop');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const sequelize = require('./util/database');
const store = new SequelizeStore({
  db: sequelize,
});

const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const CartItem = require('./models/Cart-Item');
const Order = require('./models/Order');
const OrderItem = require('./models/Order-Item');
const UserAddress = require('./models/User-Address');
const Review = require('./models/Review');

const accessLogStream = fs.createWriteStream(path.join(process.cwd(), 'access.log'), { flags: 'a' });

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1800000,
    },
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  const userId = req.session.userId;
  User.findByPk(userId)
    .then((user) => {
      req.user = user;
      return next();
    })
    .catch((error) => console.log(error));
});

app.use((req, res, next) => {
  if (req.user) {
    Cart.findOne({ where: { userId: req.user.id } })
      .then((cart) => {
        if (cart) {
          return CartItem.findAll({ where: { cartId: cart.id } })
            .then((cartItems) => {
              if (cartItems) {
                req.cart = cartItems;
              } else {
                req.cart = [];
              }
              return next();
            })
            .catch((error) => console.log(error));
        } else {
          return Cart.create({ userId: req.user.id })
            .then((cart) => {
              req.cart = [];
              return next();
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  } else {
    return next();
  }
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req, res, next) => {
  let user = {
    name: null,
    email: null,
    password: null,
  };
  let cart = [];

  if (req.user) {
    res.locals.user = req.user;
  } else {
    res.locals.user = user;
  }

  if (req.cart) {
    res.locals.cart = req.cart;
  } else {
    res.locals.cart = cart;
  }

  res.locals.csrfToken = req.csrfToken();
  return next();
});

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src-elem 'unsafe-inline' *; style-src 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; connect-src 'self' https://roloca.coldfuse.io/; img-src 'self' https:");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(userRoutes);
app.use(adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true });
User.hasOne(Cart);
Product.belongsToMany(Cart, { through: CartItem });
User.hasMany(CartItem);
User.hasMany(Order);
UserAddress.hasMany(Order);
Product.belongsToMany(Order, { through: OrderItem });
User.hasMany(UserAddress, { constraints: true });
Review.belongsTo(User);
Product.hasMany(Review);

sequelize
  // .sync({force: true})
  .sync()
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((error) => console.log(error));
