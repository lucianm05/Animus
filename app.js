const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const csrf = require('csurf');

const app = express();

const csrfProtection = csrf();

const errorController = require('./controllers/error');
// Toate rutele
const shopRoutes = require('./routes/shop');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

// Conexiunea la baza de date
const sequelize = require('./util/database');
// Store-ul pentru sesiunile de autentificare
const store = new SequelizeStore({
  db: sequelize,
});
// Modelele corespunzătoare aplicației
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const CartItem = require('./models/Cart-Item');
const Order = require('./models/Order');
const OrderItem = require('./models/Order-Item');
const UserAddress = require('./models/User-Address');
const Review = require('./models/Review');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(
  session({
    secret: '2kfd2Hj5iC7kg90A43nL',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);

app.use((req, res, next) => {
  // Verificăm dacă există un user autentificat
  if (!req.session.userId) {
    // Dacă nu există, continuăm cu celelalte middleware-uri
    return next();
  }
  // Dacă există, preluăm id-ul din sesiune, iar apoi căutăm userul corespunzător id-ului în baza de date
  const userId = req.session.userId;
  User.findByPk(userId)
    .then((user) => {
      // După ce s-a găsit userul, îl setăm în request
      req.user = user;
      return next();
    })
    .catch((error) => console.log(error));
});

app.use((req, res, next) => {
  // Dacă există un user autentificat, căutăm coșul de cumpărături care îi aparține
  if (req.user) {
    // Căutăm coșul în funcție de id-ul userului
    Cart.findOne({ where: { userId: req.user.id } })
      .then((cart) => {
        if (cart) {
          // Dacă avem un coș de cumpărături, căutăm toate produsele care aparțin coșului
          return CartItem.findAll({ where: { cartId: cart.id } })
            .then((cartItems) => {
              // Dacă s-au găsit produse, le setăm în fiecare request pentru a le afișa în navbar
              if (cartItems) {
                req.cart = cartItems;
                // Dacă nu s-au găsit produse, setăm coșul de cumpărături gol pentru a afișa număru „0” în navbar
              } else {
                req.cart = [];
              }
              // Continuăm cu celelalte middleware-uri
              return next();
            })
            .catch((error) => console.log(error));
          // Dacă nu s-a găsit un coș de cumpărături corespunzător userului, creăm unul
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

// Folosim toate rutele
app.use(userRoutes);
app.use(adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
// Dacă nu s-a găsit pagina în primele rute, utilizatorul este redirecționat pe „Pagina nu a fost găsită”
app.use(errorController.get404);

// Relațiile corespunzătoare bazei de date
Product.belongsTo(User, { constraints: true });
User.hasOne(Cart);
Product.belongsToMany(Cart, { through: CartItem });
User.hasMany(CartItem);
User.hasMany(Order);
UserAddress.hasMany(Order);
Product.belongsToMany(Order, { through: OrderItem });
User.hasMany(UserAddress);
Review.belongsTo(User);
Product.hasMany(Review);

sequelize
  // .sync({force: true})
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((error) => console.log(error));
