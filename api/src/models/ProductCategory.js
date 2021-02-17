const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
 // defino el modelo
 sequelize.define('ProductCategory', {
  productId: DataTypes.INTEGER,
  categoryId: DataTypes.INTEGER,
 });
};
