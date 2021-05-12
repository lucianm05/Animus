const userUtil = require('../util/userUtil');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const CartItem = require('../models/Cart-Item');

exports.getAddProductPage = (req, res, next) => {
  const user = userUtil.returnUser(req, res, next);
  const cart = userUtil.returnCart(req, res, next);
  let loggedIn = false;

  // Luăm coșul de cumpărături pentru a determina numărul de produse din coș, care este afișat în navbar

  // Verificăm dacă utilizatorul este autentificat
  if (user.name) {
    loggedIn = true;
  }

  if (!loggedIn) {
    if (!loggedIn) {
      return res.render('notAuth.ejs', {
        pageTitle: 'Nu sunteți autentificat!',
        user: user,
        cart: cart,
      });
    }
  }

  // Verificăm dacă utilizatorul are acces la pagina destinată adminilor
  if (user.admin) {
    return res.render('admin/add-product.ejs', {
      pageTitle: 'Adăugați un produs',
      user: user,
      cart: cart,
    });
  }

  // Dacă nu este admin, se afișează o pagină de eroare
  res.status(404).render('404.ejs', {
    pageTitle: 'Not Found',
    user: user,
    cart: cart,
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

  // Se crează produsul cu datele introduse de către admin
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
      res.redirect('/admin/add-product');
    })
    .catch((error) => console.log(error));
};
