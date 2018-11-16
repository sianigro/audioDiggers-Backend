var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const passport = require('passport');

/* GET users listing. */
router.post('/register', function(req, res, next) {


  const { errors, isValid } = validateRegisterInput(req.body);
  console.log(errors)
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
    //return res.status(400).json(errors);
  }

  userController.register(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err));

});

router.post('/login', function(req, res) {
  const { errors, isValid } = validateLoginInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  userController.login(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err));

});

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);


module.exports = router;
