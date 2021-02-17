const server = require('express').Router();
const { Order, User, Product, ProdImages } = require('../db.js');
const isAdmin = require('../Middlewares/isAdmin.js');
const isUser = require('../Middlewares/isUser.js');

server.get("/", isAdmin, (req, res) => {
  Order.findAll({
    include: {
      model: User,
    },
    order: [["id", "ASC"]],
  })
    .then((result) => {
      if (result.length === 0) {
        return res.json({ error: "No se encontraron ordenes" });
      } else {
        return res.json(result);
      }
    })
    .catch((err) => res.json({ err }));
});
server.get('/:id', isUser, (req, res) => {
    let {id} = req.params
    Order.findOne({
        where: {
            id
        },
        include: [{model: User}, {model: Product, include: [ProdImages]}]
    })
    .then(result => {
        if(result.length === 0) {
            return res.json({error: `No se encontraron ordenes con el id: ${id}`})
        } else {
            return res.json(result)
        }
    })
    .catch(err => res.json({err}))
});
server.put('/:id', isUser, (req, res) => {
    let {id} = req.params
    let {status} = req.body
    let payment_status;

    if (status === 'completa'){
        payment_status='approved';
    } 
    if (status === "cancelada"){
        payment_status='rejected'
    }
     if (status === "procesando") {
       payment_status = "pending";
     }
      if (status === "creada") {
        payment_status = "in_process";
      }
      Order.update(
        {
          status,payment_status
        },
        {
          where: { id },
          returning: true,
        }
      )
        .then((orderUpdated) => {
          if (orderUpdated[0] === 0) {
            return res.json({ err: "El producto no fue actualizado" });
          } else {
            return res.json(orderUpdated[1]);
          }
        })
        .catch((err) => res.json({ err }));
});
module.exports = server;
