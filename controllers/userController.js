const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  register: function(param) {
    return new Promise(function(resolve, reject) {
      User.findOne({ email: param.email }).then(user => {
        if (user) {
          let errors = {};
          errors.email = 'Email already exists';
          errors.status = 400;
          return reject(errors);
        } else {
          const newUser = new User({
            username: param.username,
            email: param.email,
            password: param.password
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => resolve(user))
                .catch(err => reject(err));
            });
          });
        }
      });
    });
  },
  login: function(params) {
    const email = params.email;
    const password = params.password;

    return new Promise(function(resolve, reject) {
      User.findOne({ email }).then(user => {
        if (!user) {
          let errors = {};
          errors.email = 'User not found';
          errors.status = 400;
          reject(errors);
        }

        bcrypt.compare(password, user.password).then(isMatch => {
          console.log(isMatch);

          if (isMatch) {
            const payload = {
              id: user._id,
              email: user.email,
              username: user.username
            };
            console.log(payload);
            console.log(process.env.SECRET_KEY);
            jwt.sign(
              payload,
              process.env.SECRET_KEY,
              {
                expiresIn: 3600
              },
              (err, token) => {
                if (err) {
                  console.log(err);
                  reject(err);
                }
                console.log(token);
                // res.json({
                //     success: true,
                //     token: 'Bearer ' + token
                // });
                let success = {};
                success.confirmation = true;
                success.token = 'Bearer' + token;
                resolve(success);
              }
            );
          } else {
            let errors = {};
            errors.password = 'Password incorrect';
            errors.status = 400;
            reject(errors);
          }
        });
      });
    });
  }
};
