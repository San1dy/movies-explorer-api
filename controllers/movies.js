const movieSchema = require('../models/movie');
const NotFoundError = require('../errros/NotFoundError');
const ForbiddenError = require('../errros/ForbiddenError');
const BadRequestError = require('../errros/BadRequestError');

module.exports.getMovies = (request, response, next) => {
	movieSchema
    .find({})
		.then((movie) => response.status(200).send(movie))
    .catch(next);
};

module.exports.deleteMovie = (request, response, next) => {
  const { movieId } = request.params;

  movieSchema
    .findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('User not found');
      }
      if (!movie.owner.equals(request.user._id)) {
        return next(new ForbiddenError('Movie cannot be deleted'));
      }
      return movie
        .deleteOne()
        .then(() => response.send({ message: 'Movie was deleted' }));
    })
    .catch(next);
};

module.exports.createMovie = (request, response, next) => {
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
  const owner = request.user._id;

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
      owner,
    })
    .then((movie) => response.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data for movie creation'));
      } else {
        next(err);
      }
    });
};