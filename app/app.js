const express = require('express');
const movies = require('./movies.json');
const crypto = require('node:crypto');
const { validateMovie, validatePartilMovie } = require('./schemas/movies');

const app = express();
app.use(express.json());
app.disable('x-powered-by');

app.get('/', (req, res) => {
  res.send('<h1>Home</h1>');
});

app.get('/movies', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }
  res.json(movies);
});

app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movies) => movies.id === id);
  if (movie) return res.json(movie);

  res.status(404).json({ message: 'Movie not found' });
});

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body);
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(), // uuid v4
    ...result.data,
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
});

app.patch('/movies/:id', (req, res) => {
  const result = validatePartilMovie(req.body);
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }
  const { id } = req.params;
  const movieIndex = movies.findIndex((movies) => movies.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updateMovie;

  return res.json(updateMovie);
});

app.use((req, res) => {
  res.status(404).send('<h3>404 - Not found!!</h3>');
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
