const userRoutes = require('express').Router();

const { updateUserValidation } = require('../middlewares/validation');

const { getUser, updateUser } = require('../controllers/users');

userRoutes.get('/me', getUser);
userRoutes.patch('/me', updateUserValidation, updateUser);

module.exports = userRoutes;