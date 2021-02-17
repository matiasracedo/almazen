const server = require('express').Router();

const { Product, Category, ProductCategory, ProdImages, Review } = require('../db.js');


const Sequelize = require('sequelize');
const isAdmin = require('../Middlewares/isAdmin.js');
const isUser = require('../Middlewares/isUser.js');
// const Op = Sequelize.Op;


/* esta funcion es para convertir una array en un array de objetos
cada objeto tiene como key el nombre que viene por propName y el value
es cada elemento que viene en el arr enviado por parametro, se usa
para agregar imagenes junto con un producto nuevo
evalua si recibe Id de producto, en update recibe id y en findOrCreate no */
const arrayToArrayObj = (arr, propName, prodId) => {
  if (!arr) {
    return null
  } else {

    return arr.reduce((acc, cur, i) => {
      if (prodId) acc[i] = { productId: prodId, [propName]: cur }
      else {
        acc[i] = { [propName]: cur }
      };
      return acc;
    }, [])
  }
}

/* Rutas /products */
server.get("/", (req, res, next) => {
  Product.findAll({
    //Busca todos los productos que esten con estado 'active'
    include: {
      all: true,
    },
    where: {
      status: "active",
    },
    order: [["name", "ASC"]],
  })
    .then((products) => {
      res.send(products);
    })
    .catch(next);
});
// server.get('/stock', async (req, res) => {
//   const {idsArray} = req.body;
//   try {
//    const products = await Product.findAll({
//       attributes: ['id','name', 'stock'],
//       where: {
//         id: {
//           [Op.in]: idsArray
//         }
//       }
//     });
//     res.json(products)
//   } catch (error) {
//     res.json(error)
//   }
// });

server.get("/:id", (req, res) => {
  const { id } = req.params;
  if (id) {
    //Si llega in id se busca el primer producto con ese id y que tenga estado 'active'
    Product.findOne({
      include: {
        all: true,
      },
      where: {
        id,
        status: "active",
      },
    })
      .then((product) => {
        return res.json(product);
      })
      .catch((err) => res.json({ error: err }));
  }
});

//**Ruta para agargar productos junto con las fotos y setea las categorias /
server.post('/', isAdmin, (req, res) => {
  const { name, description, price, stock, images, imageUrl, categories } = req.body;

  if (!name) res.status(400).json({ msg: 'Error: El campo name debe ser completado' }); //Si no ingresa name

  Product.findOrCreate({
    where: { name: name },
    defaults: {
      name: name.toLowerCase(),
      description,
      price,
      stock,
      imageUrl, //Si no lo encuentra estos son los valores para crear 
    },
  }
  ).then((result) => {
    const [prod, exist] = result
    !exist && res.json({ msg: 'El producto ya existe, revisar status' }); //En caso de false retornamos un msg de error
    prod.setCategories(categories)
    images && ProdImages.bulkCreate(arrayToArrayObj(images, 'name', prod.id))
      .then((img) => console.log(img))//la funcion llamada convierteun array comun en array de objetos
    res.json(result)
  })
    .catch((err) => res.json({ error: err }));
});

let arn = []
let uniqueArray;
function delDupli(string) {
  /* recibe un strings de palabras separadas por comas
  y devuelve un array sin duplicados */
  const arr = string.split(',')
  arn = arr.concat(arn)
  dataArr = new Set(arn)
  uniqueArray = [...dataArr]
  return uniqueArray
}

//**Ruta para agargar productos con excel /
server.post('/excel',  isAdmin, (req, res) => {

  for (el of req.body) {
    const { name, description, price, stock, images, imageUrl, categories } = el;
    let array = delDupli(categories);//llamo a funcion para eliminar duplicados
    var arrayCatObj = arrayToArrayObj(array, 'name') //transformo el array a un array de objetos
  }
  /* agrego las categorias que voy a necesitar a la base de datos */
  Category.bulkCreate(
    arrayCatObj,
    { ignoreDuplicates: true }
  )
    .then((newCat) => {
      for (el of req.body) {
        const { name, description, price, stock, images, imageUrl, categories } = el;
        const arrCurrentCat = []
        const arrCategories = categories.split(',')
        arrCategories.map((e) => {//itero los string de categorias que vienen en categories
          Category.findOne({// por cada iteracion busco el id de la categoria
            where: { name: e }
          }).then((currenCat) => {
            arrCurrentCat.push(currenCat.id)//agrego el id a un array aux
            return arrCurrentCat
          })
            .then((arrCurrentCat) => {
              Product.findOrCreate({
                where: { name: name },
                defaults: {
                  name, description, price, stock, images, imageUrl
                }
              }).then((products) => {
                const [prod, saved] = products
                prod.setCategories(arrCurrentCat)
              })
                .catch((error) => { error })
            })
            .catch((error) => { error })
        })
      }
      res.json(newCat)
    })
    .catch((error) => { {error} })
});


server.put('/:id', isAdmin, (req, res) => {
  const { id } = req.params;
  let {
    name,
    description,
    price,
    stock,
    imageUrl,
    images,
    categories,
  } = req.body;
  if (!name && !description && !price)
    return res.status(400).json({ msg: "Debes ingresar datos para modificar" }); // Si no ingresa ningun dato
  Product.findByPk(id, {
    include: {
      all: true,
    },
  }) // Busco un producto con el id que llega por params
    .then((result) => {
      result.update(
        {
          name: name.toLowerCase(),
          description,
          price,
          stock,
          imageUrl,
        },
        {
          where: { id },
          include: { all: true },
          returning: true,
          plain: true
        }
      ).then((result) => {
        result.setCategories(categories)
        ProdImages.destroy({ where: { productId: id } })
        ProdImages.bulkCreate(arrayToArrayObj(images, 'name', id))//la funcion llamada convierteun array comun en array de objetos
      })
      res.json(result)
    })
    .catch((err) => res.json({ error: err }));
});

server.delete("/:id", isAdmin, (req, res) => {
  const { id } = req.params;
  Product.update(
    {
      //Para no eliminar datos de la DB hacemos un unpdate en lugar de destroy...
      status: "inactive", //...Cambiando el status del producto de 'active' a 'inactive'
    },
    {
      where: {
        id,
      },
    }
  )
    .then((result) => {
      if (result === 0)
        //Update devulve 0 si no pudo actualizar, y 1 si lo logro
        return res.json({
          msg: "El id no corresponde a un producto del catalogo",
        }); //Si no encontro el producto con el id dado se manda el msj de error
      return res.json({ msg: "Producto eliminado" }); //Si es actualizado se manda el msj con la confirmacion de 'eliminado'
    })
    .catch((err) => res.json({ error: err }));
});

/* Rutas /products/category */
server.get("/category/:nombreCat", (req, res) => {
  const { nombreCat } = req.params;
  if (nombreCat) {
    Product.findAll({
      //Busca los productos...
      include: [{
        model: Category, //Incluimos la tabla de categorias
        where: {
          name: nombreCat, //...Que pertenecen a la categoria pasada por params...
          status: "active", //...Con estado 'active'...
        },
      }, {
        model: ProdImages
      }],
      where: { status: "active" }, //... Y que los productos tmb esten activos
    })
      .then((result) => {
        if (!result[0]) {
          // Si devuelve un array vacio manda el msj de error
          return res.json({
            msg: "La categoría no existe o no tiene productos asignados",
          });
        }
        res.json(result); // Sino manda las categorias encontradas
      })
      .catch((err) => res.json({ error: err }));
  }
});

server.post("/category", isAdmin, (req, res) => {
  let { name, description } = req.body;
  Category.findOrCreate({
    //Se busca si la categoria ya esta creada
    where: { name },
    defaults: { name, description },
  })
    .then((result) => {
      if (result[1]) {
        //Si se creo se manda la categoria y el msj de confirmacion
        return res.json({
          createdCategory: result[0],
          msg: `La categoria ${name} ha sido creada con la description: ${description}`,
        });
      }
      res.json({ msg: `La categoria ${name} ya existe` }); //Sino se manda el msj de que la categoria ya existe
    })
    .catch((err) => res.json({ error: err }));
});

server.put("/category/:id", isAdmin, (req, res) => {
  let { id } = req.params;
  let { name, description } = req.body;
  if (!name && !description)
    // Si no se reciben los parametros obligatorios...
    return res.status(400).json({ msg: "Debes ingresar datos para modificar" }); //...Se manda el msj pidiendo los datos necesarios
  Category.findByPk(id)
    .then((category) => {
      if (category) {
        // Si encontro la categoria con el id que viene por params
        Category.update(
          {
            name,
            description, // Se actualiza con estos datos
          },
          {
            where: { id },
            returning: true, // Esto es para devolver el producto actualizado
          }
        ).then((categoryUpdated) => {
          res.json(categoryUpdated[1]); // Se manda la categoria actualizada
        });
      } else {
        res
          .status(400)
          .json({ msg: "El id no corresponde a una categoria existente" }); // Si no encontro la categoria con ese id se manda el msj de error
      }
    })
    .catch((err) => res.json({ error: err }));
});

server.delete("/category/:id", isAdmin, (req, res) => {
  let { id } = req.params;
  Category.update(
    //Para no eliminar datos de la DB hacemos un unpdate en lugar de destroy...
    { status: "inactive" }, //...Cambiando el status de la categoria de 'active' a 'inactive'
    {
      where: {
        id,
      },
    }
  )
    .then((result) => {
      if (result === 0)
        return res.json({ msg: "El id no corresponde a una Categoria valida" }); //Si no encontro la categoria con el id dado se manda el msj de error
      return res.json({ msg: "Categoria eliminada" }); //Si es 'borrado' se manda el msj con la confirmacion
    })
    .catch((err) => res.json({ error: err }));
});

// Esta rutas es para agragar relaciones manualmente desde params
server.post("/:idProduct/category/:idCategory", (req, res) => {
  const { idProduct, idCategory } = req.params;
  if (idProduct && idCategory) {
    ProductCategory.create({
      productId: idProduct,
      categoryId: idCategory,
    })
      .then(() => res.json({ msg: "Se agregó la categoría al producto" }))
      .catch((err) => res.json({ error: err }));
  }
});

// Esta ruta elimina una cetgoria del producto
server.delete("/:idProduct/category/:idCategory", (req, res) => {
  const { idProduct, idCategory } = req.params;
  if (idProduct && idCategory) {
    // Si se recibe por params el id del producto y de la categoria
    ProductCategory.destroy({
      // Se elimina esa categoria de un producto especifico
      where: {
        productId: idProduct,
        categoryId: idCategory,
      },
    })
      .then(() => res.json({ msg: "Se eliminó la categoría del producto" }))
      .catch((err) => res.json({ error: err }));
  }
});

//Esta ruta agrega una review al producto
server.post("/:id/review", isUser, (req, res) => {
  try {
    const { id } = req.user;
    const productId = req.params.id;
    const { rating, description } = req.body;
    Review.findOrCreate({
      where: {
        userId: id,
        productId,
      },
      defaults: {
        rating,
        description,
        userId: id,
        productId,
      },
    }).then((result) => {
      if (result[1]) return res.json(result[0]);
      else res.json({ msg: "Ya realizaste una review para este producto" });
    });
  } catch (error) {
    return res.json({ msg: error });
  }
});

//Esta ruta es para modificar una review
server.put("/:id/review/:idReview", isUser, (req, res) => {
  try {
    const { id, idReview } = req.params;
    const { rating, description } = req.body;
    Review.update(
      {
        rating,
        description,
      },
      {
        where: {
          id: idReview,
        },
        returning: true,
      }
    ).then((result) => {
      if (result[0]) return res.json(result[1]);
      else return res.json({ msg: "La review no fue actualizada" });
    });
  } catch (error) {
    return res.json({ msg: error });
  }
});

// Esta ruta es para eliminar un review
server.delete("/:id/review/:idReview", isUser, (req, res) => {
  try {
    const { idReview } = req.params;
    Review.destroy({
      where: {
        id: idReview,
      },
    }).then(() => res.json({ msg: "Se eliminó la review del producto" }));
  } catch (error) {
    return res.json({ msg: error });
  }
});

server.get("/:id/review/", (req, res) => {
  try {
    const { id } = req.params;
    Review.findAll({
      where: {
        productId: id,
      },
      include: {
        all: true,
      },
    }).then((response) => res.json(response));
  } catch (error) {
    res.json({ msg: error });
  }
});

module.exports = server;
