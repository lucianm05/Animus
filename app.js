const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const errorController = require('./controllers/error');
const shopRoutes = require('./routes/shop');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const sequelize = require('./util/database');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const CartItem = require('./models/Cart-Item');
const Order = require('./models/Order');
const OrderItem = require('./models/Order-Item');
const UserAddress = require('./models/User-Address');

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => console.log(error));
});

app.use((req, res, next) => {
  if(req.user) {
    return Cart.findOne({ where: { userId: req.user.id } })
    .then((cart) => {
      return CartItem.findAll({ where: { cartId: cart.id } });
    })
    .then((cartItems) => {
      req.cart = cartItems;
      next();
    });
  }

  return next();
})

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(process.cwd(), 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(userRoutes);
app.use(adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasOne(Cart);
Product.belongsToMany(Cart, { through: CartItem });
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
User.hasMany(UserAddress);

sequelize
  // .sync({force: true})
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'zvenko', email: 'lucianmg05@gmail.com', password: 'parola', admin: true });
    }
    return user;
  })
  .then((user) => {
    Cart.findOrCreate({ where: { userId: user.id } });
  })
  .then((result) => {
    app.listen(3000);
  })
  .catch((error) => console.log(error));
