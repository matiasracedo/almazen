const server = require("express").Router();
const { Category } = require("../db.js");
/* 
    Para facilitar un poco el testeo se crearon estas rutas adicionales
    Hablando con mati creemos que se necesita un refactoreo de ciertas rutas.
*/
server.get("/", (req, res) => {
  Category.findAll({
    // Se buscan todas las categorias con estado 'active'
    where: {
      status: "active",
    },
    order: [["name", "ASC"]],
  }).then((result) => res.json(result)); // Se devuelven las categorias encontradas
});

server.get("/:id", (req, res) => {
  let { id } = req.params;
  if (id) {
    Category.findOne({
      // Se busca la categoria con el id que viene por params con estado 'active'
      where: {
        id,
        status: "active",
      },
    }).then((result) => res.json(result)); //Se envia la categoria encontrada
  }
});

module.exports = server;
