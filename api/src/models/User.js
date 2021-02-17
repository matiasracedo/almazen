const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  const User = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      set(passUser){
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(passUser, salt)
        this.setDataValue('password', hash)
      }
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    address:{
      type: DataTypes.TEXT,
      allowNull:true,
    }
  });
  User.prototype.compare = function(passUser) {
    return bcrypt.compareSync(passUser, this.password)
  }
  return User
};

