import { Movie, Actor } from '../models/model-relationships.js';
import { sequelize } from '../db.js';
import { Op } from 'sequelize';

export default class MovieController {
  async createMovie(movieData, t) {
    const { title, year, format, actors = [] } = movieData;

    const actorsToAdd = await this.findOrCreateActor(actors, t);

    const movie = await Movie.create(
      {
        title,
        year,
        format,
      },
      { transaction: t },
    );

    if (actorsToAdd.length > 0) {
      await movie.addActors(actorsToAdd, { transaction: t });
    }

    await movie.reload({ include: [Actor], transaction: t });

    return movie;
  }

  async create(req, res) {
    const t = await sequelize.transaction();

    try {
      const movie = await this.createMovie(req.body, t);

      await t.commit();
      res.status(201).json({ error: false, result: movie });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: true, message: error.message });
    }
  }

  async show(req, res) {
    try {
      const movie = await Movie.findByPk(req.params.id, {
        include: [Actor],
      });
      res.status(200).json({ movie });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  async update(req, res) {
    const t = await sequelize.transaction();

    try {
      const movie = await Movie.findByPk(req.params.id, {
        include: [Actor],
        transaction: t,
      });

      if (!movie) {
        await t.rollback();
        return res
          .status(404)
          .json({ error: true, message: 'Movie not found' });
      }

      if (req.body.actors) {
        const actorsToSet = await this.findOrCreateActor(req.body.actors, t);
        await movie.setActors(actorsToSet, { transaction: t });
        delete req.body.actors;
      }

      await movie.update(req.body, { transaction: t });

      await movie.reload({ include: [Actor], transaction: t });

      await t.commit();
      return res.status(200).json({ error: false, result: movie });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({ error: true, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const deletedRowsCount = await Movie.destroy({
        where: { id: req.params.id },
      });

      if (deletedRowsCount === 0) {
        return res
          .status(404)
          .json({ error: true, message: 'Movie not found' });
      }

      return res
        .status(200)
        .json({ error: false, message: 'Movie deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  }

  async findOrCreateActor(actorsToCheck, transaction = null) {
    const actors = [];
    for (const actorName of actorsToCheck) {
      const trimmedName = actorName.trim();

      if (trimmedName.length === 0) {
        continue;
      }

      const [actor] = await Actor.findOrCreate({
        where: { name: trimmedName },
        transaction,
      });
      actors.push(actor);
    }

    return actors;
  }

  async list(req, res) {
    try {
      const {
        search,
        actor,
        title,
        sort = 'id',
        order = 'ASC',
        limit = 20,
        offset = 0,
      } = req.query;

      let whereCondition = {};
      let includeCondition = {
        model: Actor,
        required: false,
      };

      const limitNum = parseInt(limit, 10);
      const offsetNum = parseInt(offset, 10);

      if (actor) {
        includeCondition.required = true;
        includeCondition.where = { name: { [Op.like]: `%${actor}%` } };
      }

      if (title) {
        whereCondition.title = { [Op.like]: `%${title}%` };
      }

      if (search) {
        const moviesByTitle = await Movie.findAll({
          where: {
            title: { [Op.like]: `%${search}%` },
          },
          include: [{ model: Actor }],
        });

        const moviesByActor = await Movie.findAll({
          include: [
            {
              model: Actor,
              where: { name: { [Op.like]: `%${search}%` } },
              required: true,
            },
          ],
        });

        const movieIds = new Set();
        const combinedMovies = [];

        for (const movie of [...moviesByTitle, ...moviesByActor]) {
          if (!movieIds.has(movie.id)) {
            movieIds.add(movie.id);
            combinedMovies.push(movie);
          }
        }

        combinedMovies.sort((a, b) => {
          if (sort === 'year') {
            return order.toUpperCase() === 'ASC'
              ? a.year - b.year
              : b.year - a.year;
          } else if (sort === 'title') {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            if (order.toUpperCase() === 'ASC') {
              return titleA.localeCompare(titleB, 'uk-UA');
            } else {
              return titleB.localeCompare(titleA, 'uk-UA');
            }
          } else {
            return order.toUpperCase() === 'ASC' ? a.id - b.id : b.id - a.id;
          }
        });

        const paginatedMovies = combinedMovies.slice(
          offsetNum,
          offsetNum + limitNum,
        );

        return res.status(200).json({ error: false, result: paginatedMovies });
      }

      let sortField = 'id';
      if (sort === 'year') {
        sortField = 'year';
      } else if (sort === 'title') {
        sortField = 'title';
      }

      if (sortField === 'title') {
        const allMovies = await Movie.findAll({
          where: whereCondition,
          include: [includeCondition],
        });

        allMovies.sort((a, b) => {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();

          if (order.toUpperCase() === 'ASC') {
            return titleA.localeCompare(titleB, 'uk-UA');
          } else {
            return titleB.localeCompare(titleA, 'uk-UA');
          }
        });

        const paginatedMovies = allMovies.slice(
          offsetNum,
          offsetNum + limitNum,
        );
        return res.status(200).json({ error: false, result: paginatedMovies });
      } else {
        const movies = await Movie.findAll({
          where: whereCondition,
          include: [includeCondition],
          order: [[sortField, order]],
          limit: limitNum,
          offset: offsetNum,
        });

        return res.status(200).json({ error: false, result: movies });
      }
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  parseMovies(text) {
    const blocks = text.trim().split(/\r?\n\s*\r?\n/);
    const movies = [];

    for (const block of blocks) {
      const lines = block.split(/\r?\n/);
      const movieReq = {};

      for (let raw of lines) {
        const line = raw.trimStart();

        if (line.toLowerCase().startsWith('title:')) {
          movieReq.title = line.slice(6).trim();
        } else if (line.toLowerCase().startsWith('release year:')) {
          movieReq.year = parseInt(line.slice(13).trim(), 10);
        } else if (line.toLowerCase().startsWith('format:')) {
          movieReq.format = line.slice(7).trim();
        } else if (line.toLowerCase().startsWith('stars:')) {
          movieReq.actors = line
            .slice(6)
            .split(',')
            .map((actor) => actor.trim())
            .filter(Boolean);
        }
      }

      if (Object.keys(movieReq).length > 0) {
        movies.push(movieReq);
      }
    }

    return movies;
  }

  async importMoviesFromFile(req, res) {
    const t = await sequelize.transaction();

    try {
      if (!req.file) {
        await t.rollback();
        return res
          .status(400)
          .json({ error: true, message: 'No file uploaded' });
      }

      const fileContent = req.file.buffer.toString('utf-8');
      const movies = this.parseMovies(fileContent);

      if (movies.length === 0) {
        await t.rollback();
        return res
          .status(400)
          .json({ error: true, message: 'No valid movies found in the file' });
      }

      const createdMovies = [];

      for (const movieData of movies) {
        try {
          const movie = await this.createMovie(movieData, t);
          createdMovies.push(movie);
        } catch (error) {
          console.error(`Error creating movie: ${error.message}`);
        }
      }

      if (createdMovies.length === 0) {
        await t.rollback();
        return res
          .status(400)
          .json({ error: true, message: 'Failed to create any movies' });
      }

      await t.commit();
      return res.status(201).json({
        error: false,
        message: `Successfully imported ${createdMovies.length} movies`,
        result: createdMovies,
      });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({ error: true, message: error.message });
    }
  }
}
