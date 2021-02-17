const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
 // defino el modelo
 sequelize.define('product', {
  name: {
   type: DataTypes.STRING,
   allowNull: false,
   unique:true
  },
  description: {
   type: DataTypes.TEXT,
  },
  price: {
   type: DataTypes.INTEGER,
   allowNull: false,
  },
  stock: {
   type: DataTypes.INTEGER,
   defaultValue: 0,
  },
  imageUrl:{
    type: DataTypes.TEXT,
  },
  images:{
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true
  },
  status:{
    type: DataTypes.ENUM("active","inactive"),
    defaultValue: "active",
  }
});
};
