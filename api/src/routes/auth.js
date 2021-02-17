const server = require("express").Router();
const { User } = require("../db.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const isUser = require("../Middlewares/isUser.js");
const isAdmin = require("../Middlewares/isAdmin.js");

server.post("/login", (req, res, next) => {
  try {
    passport.authenticate("local", { session: false }, function (err, user) {
      if (err) return next(err);
      else if (!user) return res.sendStatus(401);
      else
        return res.json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            address: user.address
          },
          token: jwt.sign(
            {
              id: user.id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin,
            },
            JWT_SECRET
          ),
        });
    })(req, res, next);
  } catch (err) {
    res.sendStatus(500);
  }
});

// RUTA PARA PROMOVER UN USUARIO DE USUARIO A ADMIN
server.post("/promote/:id", isAdmin, async (req, res) => {
  // Traigo el id de la peticion y el reqbody mandará un objeto de la forma { isAdmin: true o false}
  const { id } = req.params;
  const { isAdmin } = req.body;
  try {
    // busco al usuario y lo updateo con la propiedad tal cual viene en body
    const user = await User.update({ isAdmin: isAdmin }, { where: { id } })
    //El metodo update trae [1] si se actualizo o [0] si no lo hizo
    if (!!user[0]) {
      res.json({ result: true, msg: 'El usuario ha sido actualizado' });
    } else {
      res.json({ result: false, msg: 'Ha ocurrido un problema y el usuario no se ha actualizado' })
    }
  } catch (err) {
    res.json({ msg: err });
  }
});
// server.post("/register", async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     return res.json({ user, token: jwt.sign(user, JWT_SECRET) });
//   } catch (err) {
//     res.json({ msg: err });
//   }
// });

/* Esta ruta se utilizara para renderizar todo lo vinculado a dicho usuario en su perfil. O tal vez no. */
server.get("/me", isUser, async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({ where: id, include: { all: true } });
    if (user) {
      return res.json({
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        id: user.id,
        address: user.address
      });
    } else return res.sendStatus(401);
  } catch (err) {
    res.json({ msg: err });
  }
});

server.get('/logout', isUser, (req, res) => {
  try {
    req.user = null;
    res.json({ msg: 'Usuario deslogueado.'});
  } catch (err) {
    res.json({ msg: err });
  }
});

module.exports = server;
