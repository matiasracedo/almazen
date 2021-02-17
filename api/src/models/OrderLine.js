const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('orderLine', {
     productId: {
         type: DataTypes.INTEGER
     },
     orderId: {
         type: DataTypes.INTEGER
     },
     price: {
         type: DataTypes.INTEGER,
         allowNull: false   
     },
     quantity: {
         type: DataTypes.INTEGER,
         allowNull: false
     }
    });
   };