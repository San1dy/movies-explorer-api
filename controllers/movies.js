const movieSchema = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');

const {
  INCORRECT_DATA_CREATE_MOVIES,
  MOVIE_NOT_FOUND,
  NOT_ENOUGH_RIGHTS,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  const { _id } = req.user;

  Movie.find({})
    .populate(['owner'])
    .then((movies) => res.send({
      data: movies.filter((movie) => movie.owner._id.toString() === _id),
    }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = request.body;
  const { _id } = req.user;

  movieSchema
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: _id,
    })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(INCORRECT_DATA_CREATE_MOVIES));
      }

      next(err);
    });
};
module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const { _id } = req.user;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError(MOVIE_NOT_FOUND));
      }
      if (_id !== movie.owner.toString()) {
        return next(new ForbiddenError(NOT_ENOUGH_RIGHTS));
      }

      movie.remove()
        .then(() => res.send({ data: movie }))
        .catch(next);
    })
    .catch(next);
};