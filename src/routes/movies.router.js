import { Router } from 'express';
import multer from 'multer';
import MovieController from '../controllers/movie.controller.js';
import {
  validateCreateMovie,
  validateUpdateMovie,
  validateListMovies,
} from '../middleware/validation.middleware.js';

const movieRouter = Router();
const movieController = new MovieController();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

movieRouter.post('/', validateCreateMovie, (req, res) =>
  movieController.create(req, res),
);
movieRouter.patch('/:id', validateUpdateMovie, (req, res) =>
  movieController.update(req, res),
);
movieRouter.delete('/:id', (req, res) => movieController.delete(req, res));
movieRouter.get('/:id', (req, res) => movieController.show(req, res));
movieRouter.get('/', validateListMovies, (req, res) =>
  movieController.list(req, res),
);
movieRouter.post('/import', upload.single('movies'), (req, res) =>
  movieController.importMoviesFromFile(req, res),
);
export default movieRouter;
