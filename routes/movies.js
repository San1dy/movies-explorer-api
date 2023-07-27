const router = require('express').Router();

const {
	getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');

const { validationCreateMovie, validationParamsControllersMovies } = require('../utils/validation');

router.get('/', getMovies);
router.post('/', validationCreateMovie, createMovie);
router.delete('/:movieId', validationParamsControllersMovies, deleteMovie);

module.exports = router;