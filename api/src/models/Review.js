const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('review',{
        rating:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        description:{
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}