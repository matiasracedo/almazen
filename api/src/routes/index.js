const { Router } = require('express');
const { Product } = require('../db.js');
const Op = require('sequelize').Op;
// import all routers;
const productRouter = require('./product.js');
const categoryRouter = require('./category.js');
const userRouter = require('./users.js');
const orderRouter = require('./orders.js');
const authRouter = require('./auth.js');
const mercadopago = require('./mercadopago');

const router = Router();

// load each router on a route
// i.e: router.use('/auth', authRouter);
router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/category', categoryRouter);
router.use('/users', userRouter);
router.use('/orders', orderRouter);
router.use('/mercadopago', mercadopago);

router.get('/search', (req, res) => {
  let { name } = req.query;
  Product.findAll({
    // Se buscan todos los productos que matcheen con el query con estado 'active'
    where: {
      name: {
        [Op.substring]: name.toLowerCase(), // Busca como LIKE %hola% en SQL
      },
      status: 'active',
    },
  }).then((result) => {
    if (!result[0]) {
      // Si devuelve un array vacio xq no encontro productos...
      return res.json({ msg: `No se encontro el producto` }); //...Se manda el msj de error...
    } else {
      res.json({ result, msg: `Encontramos el producto ${name}` }); //...Sino se retornan los productos encotrados y se manda el msj de exito
    }
  });
});

module.exports = router;
