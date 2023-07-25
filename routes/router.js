const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');
const {
	createUserValidation,
  loginValidation,
} = require('../middlewares/validation');

const userRoutes = require('./users');
const movieRoutes = require('./movies');

router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);
router.use(auth);
router.use('/users', userRoutes);
router.use('/cards', movieRoutes);
router.use('/*', (req, res, next) => {
  next(new NotFoundError('This page does not exist'));
});

module.exports = router;