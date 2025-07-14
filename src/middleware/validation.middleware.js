import { body, param, query, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: errors.array()[0].msg,
    });
  }
  next();
};

export const validateRegister = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage('Please provide a valid email address'),

  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/)
    .withMessage('Name must start with a letter and be 3–16 characters.'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/)
    .withMessage('Password must be 8–64 chars with upper, lower and digit.'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  handleValidationErrors,
];

export const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .matches(
      /^(?!\s)(?!.*\s{2,})[\w\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+(?<!\s)$/,
    )
    .withMessage(
      'Password should not contain excessive spaces and can only include letters, numbers, and special characters',
    ),

  handleValidationErrors,
];

export const validateCreateMovie = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),

  body('year')
    .notEmpty()
    .withMessage('Year is required')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`Year must be between 1900 and ${new Date().getFullYear()}`),

  body('format')
    .notEmpty()
    .withMessage('Format is required')
    .isIn(['VHS', 'DVD', 'Blu-Ray'])
    .withMessage('Format must be VHS, DVD, or Blu-Ray'),

  body('actors').isArray().withMessage('Actors must be an array').optional(),

  body('actors.*')
    .isString()
    .withMessage('Actor name must be a string')
    .isLength({ min: 1, max: 255 })
    .withMessage('Actor name must be between 1 and 255 characters'),

  handleValidationErrors,
];

export const validateUpdateMovie = [
  param('id').isInt().withMessage('Movie ID must be an integer'),

  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),

  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`Year must be between 1900 and ${new Date().getFullYear()}`),

  body('format')
    .optional()
    .isIn(['VHS', 'DVD', 'Blu-Ray'])
    .withMessage('Format must be VHS, DVD, or Blu-Ray'),

  body('actors').optional().isArray().withMessage('Actors must be an array'),

  body('actors.*')
    .isString()
    .withMessage('Actor name must be a string')
    .isLength({ min: 1, max: 255 })
    .withMessage('Actor name must be between 1 and 255 characters'),

  handleValidationErrors,
];

export const validateListMovies = [
  query('search').optional().isString().withMessage('Search must be a string'),

  query('actor').optional().isString().withMessage('Actor must be a string'),

  query('title').optional().isString().withMessage('Title must be a string'),

  query('sort')
    .optional()
    .isString()
    .withMessage('Sort must be a string')
    .isIn(['id', 'title', 'year'])
    .withMessage('Possible values: id, title, year'),

  query('order')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Order must be ASC or DESC'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),

  handleValidationErrors,
];
