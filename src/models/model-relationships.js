import { Actor } from './actor.model.js';
import { Movie } from './movie.model.js';

Actor.belongsToMany(Movie, { through: 'ActorMovies' });
Movie.belongsToMany(Actor, { through: 'ActorMovies' });

export { Actor, Movie };
