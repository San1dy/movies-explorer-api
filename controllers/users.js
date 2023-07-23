const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.getUser = (req, res, next) => {
  userSchema
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;

  try {
    const user = userSchema.findByIdAndUpdate(
      req.user._id,
      {
        email,
        name,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      throw new NotFoundError('User not found');
    }
    res.status(200).send(user);
  } catch (err) {
		next(err);
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return userSchema
    .findOne({ email })
    .select('+password')
    .then((user) => {
      const passwordCheck = bcrypt.compare(password, user.password);
      if (!user || !passwordCheck) {
        throw new UnauthorizedError('Wrong email or password');
      }
      const token = jwt.sign({ _id: user._id }, 'gen', {
        expiresIn: '7d',
      });
      res.send({ token, message: 'Successfully logging in' });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      userSchema
        .create({
          name,
          email,
          password: hash,
        })
        .then((user) => {
          res.status(201).send({
            name: user.name,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            return next(
              new ConflictError(
                'The username with this email has already been registered',
              ),
            );
          }
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Incorrect input'));
          }
          return next(err);
        });
    })
    .catch(next);
};