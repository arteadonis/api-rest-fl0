const z = require('zod');

const movieSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Movies title must be a string',
    })
    .min(1)
    .max(100),
  genre: z
    .array(z.enum(['Action', 'Comedy', 'Drama', 'Horror', 'Thriller']))
    .min(1)
    .max(10),
  year: z.number().min(1900).max(2024).int(),
  director: z.string().min(1).max(100),
  duration: z.number().min(1).max(500),
  rate: z.number().min(1).max(10).optional().default(5),
  poster: z.string().url({
    message: 'Poster must be a valid URL',
  }),
});

function validateMovie(object) {
  return movieSchema.safeParse(object);
}

function validatePartilMovie(object) {
  return movieSchema.partial().safeParse(object);
}

module.exports = {
  validateMovie,
  validatePartilMovie,
};
