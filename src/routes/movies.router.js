import { Router } from 'express';
import multer from 'multer';
import MovieController from '../controllers/movie.controller.js';

const movieRouter = Router();
const movieController = new MovieController();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

movieRouter.post('/', (req, res) => movieController.create(req, res));
movieRouter.patch('/:id', (req, res) => movieController.update(req, res));
movieRouter.delete('/:id', (req, res) => movieController.delete(req, res));
movieRouter.get('/:id', (req, res) => movieController.show(req, res));
movieRouter.get('/', (req, res) => movieController.list(req, res));
movieRouter.post('/import', upload.single('movies'), (req, res) =>
  movieController.importMoviesFromFile(req, res),
);
export default movieRouter;
