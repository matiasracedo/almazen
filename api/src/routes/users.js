const server = require("express").Router();
const { User, Order, OrderLine, Product, ProdImages } = require("../db.js");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const isAdmin = require("../Middlewares/isAdmin.js");
const isUser = require("../Middlewares/isUser.js");

server.post("/", async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const user = await User.findOrCreate({
      where: {
        email,
      },
      defaults: {
        name,
        email,
        password,
        isAdmin,
      },
    });
    if (user[1]) {
      const { id, name, email, isAdmin } = user[0].dataValues;
      return res.json({
        msg: "El usuario ha sido creado correctamente!",
        result: user[0].dataValues,
        token: jwt.sign({ id, name, email, isAdmin }, JWT_SECRET),
      });
    } else {
      return res.json({result:false, msg: "Este email ya esta registrado" });
    }
  } catch (error) {
    res.json(error);
  }
});

server.get("/", isAdmin, (req, res) => {
  User.findAll({
    where: {
      status: "active",
    },
    attributes: { exclude: ["password"] },
    order: [["id", "ASC"]],
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({ msg: err });
    });
});

server.delete("/:id", isUser, (req, res) => {
  const { id } = req.params;
  User.update(
    {
      status: "inactive",
    },
    {
      where: {
        id,
      },
      returning: true,
    }
  )
    .then((result) => {
      if (result[0] === 0) {
        return res.json({ err: "El usuario no fue actualizado" });
      } else {
        return res.json(result[1]);
      }
    })
    .catch((err) => {
      res.json({ msg: err });
    });
});

server.put("/:id", isUser, (req, res) => {
  const { id } = req.params;
  const { name, email, address } = req.body;

  User.update(
    { name, email, address },
    {
      where: {
        id,
      },
      returning: true,
    }
  )
    .then((result) => {
      if (!result[0]) {
        // el result es para manejar mas facil en el front
        return res.json({
          result: false,
          msg: "No se pudo actualizar tu usuario",
        });
      } else {
        res.json({
          result: true,
          msg: "Se ha actualizado tu usuario exitosamente!",
          user: result[1],
        });
      }
    })
    .catch((err) => {
      res.json({ msg: err });
    });
});

//RUTA PARA OLVIDO DE CONTRASEÑA
server.patch('/passwordOlvidado', async (req,res)=>{
  const {email, confirm}=req.body;

  function generatePassword() {
    let length = 9,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  if (email && confirm){
    try{
      const newPassword=generatePassword()
      let ref = await User.update({ password: newPassword }, { where: { email }, returning: true });
      if (!!ref[0]) {
        console.log(ref)
        // el result es para preguntar en front si se cambio exitosamente la contraseña o no
        return res.json({ result: true, msg: "Se envío un email con tu contraseña provisional", password:newPassword, name:ref[1][0].dataValues.name });
      } else {
        return res.json({ result: false, msg: "El email que enviaste no coincide con uno registrado en nuestra pagina" });
      }
    }catch(err){
     return  res.json({result:false, err:err})
    }
  }else{
    return res.json({msg:'Hacen falta ambos campos para cambiar la contraseña'})
  }
})

// RUTA PARA PASSWORD RESET
server.put("/password/:id", isUser, async (req, res) => {
  const { id } = req.params;
  const { password, newPassword } = req.body;
  try {
    // Aqui busco al usuario con el id de la peticion
    const user = await User.findByPk(id);
    // aca uso el metodo de los usuarios para comparar la contraseña que se me envia a ver si coincide
    //si coincide, se le permite cambiar la contraseña, sino no
    if (password && user.compare(password)) {
      // El metodo update me devuelve [1] si actualiza y [0] si no lo hace
      let ref = await User.update({ password: newPassword }, { where: { id } });

      if (!!ref[0]) {
        // el result es para preguntar en front si se cambio exitosamente la contraseña o no
        res.json({ result: true, msg: "Contraseña editada exitosamente" });
      } else {
        res.json({ result: false, msg: "No se pudo actualizar la contraseña" });
      }
    } else {
      res.json({
        result: false,
        msg: "La contraseña que ingresó el usuario no es correcta",
      });
    }
  } catch (err) {
    res.json(err);
  }
});
/* --- Orders & Cart --- */

/* Trae todas las ordenes de un usuario especifico. */
server.get("/:id/orders", isUser, async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.findAll({
      where: {
        [Op.not]: [
          {
            status: ["carrito"],
          },
        ],
      },
      include: [{ model: User, where: { id } }],
      order:[['id','ASC']]
    });

    if (orders[0]) res.json(orders);
    else
      res.json({ msg: "No se encontraron ordenes asociadas a este usuario" });
  } catch (err) {
    res.json({ err });
  }
});

/* Pasamos el estado de la orden de carrito a creada con todos sus items y cantidades */
server.put("/:userId/cart", isUser, async (req, res) => {
  //para cuando confirma el carrito.
  try {
    const { userId } = req.params;
    const { products, crear } = req.body;

    const order = await Order.findOne({
      include: { all: true },
      where: { userId, status: "carrito" },
    });

    const orderRestore = await OrderLine.destroy({
      where: { orderId: order.id },
    }).then(() => {
      if (crear) {
        var qty;
        products.forEach((product) => {
          OrderLine.create(product)
            .then(() => {
              Product.findOne({ where: { id: product.productId } }).then(
                (prod) => {
                  qty = prod.dataValues.stock;
                  Product.update(
                    { stock: qty - product.quantity },
                    { where: { id: product.productId }, returning: true }
                  );
                }
              );
            })
            .then((resu) => console.log(resu));
        });
      } else {
        products.forEach((product) => {
          OrderLine.create(product);
        });
      }
    });
    const orderUpdated = await Order.update(
      { status: crear ? "creada" : "carrito" },
      { where: { id: order.id }, returning: true }
    );

    if (orderUpdated[0]) res.json(orderUpdated[1]);
    else res.json({ err: "El producto no fue actualizado" });
  } catch (err) {
    res.json({ err });
  }
});

server.get("/:userId/cart", isUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const order = await Order.findOne({
      include: [{model: Product, include: [ProdImages]}, {model: User}],
      where: { userId, status: "carrito" },
    });
    if (!order) return res.json({ msg: "No se encontraron ordenes" });
    else res.json({ count: order.products.length, order });
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
});

/* Agrego items al carrito + contador de productos */
server.post("/:userId/cart", isUser, async (req, res) => {
  try {
    let { userId } = req.params;
    const { productId, quantity } = req.body;
    let producto = await Product.findOne({ where: { id: productId } });
    var price = producto.price;
    let order = await Order.findOrCreate({
      where: { userId, status: "carrito" },
      include: { all: true },
      returning: true,
    });
    if (order[1]) {
      var orderLine = await OrderLine.create({
        productId,
        orderId: order[0].id,
        price,
        quantity,
      });
    } else {
      var match = false;
      var cantidad;
      order[0].products.forEach((product) => {
        if (product.id === parseInt(productId)) {
          match = true;
          cantidad = parseInt(product.orderLine.quantity);
        }
      });
      if (match) {
        var [updated, orderLine] = await OrderLine.update(
          { quantity: cantidad + parseInt(quantity) }, //a la cantida existente le sumo la enviada por body
          {
            where: {
              [Op.and]: [{ orderId: order[0].id }, { productId: productId }],
            }, //edito x productId y OrderId
            returning: true, //para que devuelva el item editado
          }
        );
        orderLine = orderLine[0];
      } else {
        var orderLine = await OrderLine.create({
          productId,
          orderId: order[0].id,
          price,
          quantity,
        });
      }
      let contador = await OrderLine.count({
        where: { orderId: order[0].id },
      });
      res.json({ contador, orderLine });
    }
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

/* Vacia todo el carrito */
server.delete("/:userId/cart", isUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const order = await Order.findOne({
      include: { all: true },
      where: { userId, status: "carrito" },
    });
    const orderDestroyed = await OrderLine.destroy({
      where: { orderId: order.id },
    });
    res.json({ orderDestroyed, msg: "Se vacio el carrito" });
  } catch (err) {
    res.json({ err });
  }
});
/* Borra un producto especifico del carrito */
server.delete("/:userId/cart/:productId", isUser, async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const order = await Order.findOne({
      include: { all: true },
      where: { userId, status: "carrito" },
    });

    const orderDestroyed = await OrderLine.destroy({
      where: { orderId: order.id, productId },
    });

    res.json({ orderDestroyed, msg: "Se borro el producto" });
  } catch (err) {
    res.json({ err });
  }
});

module.exports = server;
