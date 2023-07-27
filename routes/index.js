const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { validationSignup, validationSignin } = require('../utils/validation');
const auth = require('../middlewares/auth');
const pageNotFound = require('../middlewares/pageNotFound');

router.post('/signin', loginValidation, login);
router.post('/signup', validationSignup, createUser);
router.use(auth);
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));
router.use('*', pageNotFound);

module.exports = router;