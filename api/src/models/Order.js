
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
sequelize.define('order', {
    status:{
        type:DataTypes.ENUM('carrito', 'creada', 'procesando', 'cancelada', 'completa'),
        defaultValue: 'carrito'
    },
    payment_id:{
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    payment_status:{
        type: DataTypes.STRING,
        defaultValue: ""
    },
    merchant_order_id: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    }   
})
};