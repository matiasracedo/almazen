const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const { User } = require('./db.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET } = process.env;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
       const user= await User.findOne({where:{email}})
        if(!user) return done(null, false);
        if (!user.dataValues) {
          return done(null, false);
        } 
        if (!user.compare(password)) {
          return done(null, false);
        }
        return done(null, user.dataValues);
       
    //   User.findOne({ where: { email } }, function (err, user) {
    //     if (err) {
    //       return done(err);
    //     }
    //     if (!user) {
    //       return done(null, false);
    //     }
    //     if (!user.compare(password)) {
    //       return done(null, false);
    //     }
    //     return done(null, user);
    //   });
    }
  )
);

passport.use(new BearerStrategy(
    function (token, done) {
        jwt.verify(token, JWT_SECRET, function (err, user) {
            if (err) { return done(err); }
            return done(null, user ? user : false)
        })
    }
));

module.exports = passport