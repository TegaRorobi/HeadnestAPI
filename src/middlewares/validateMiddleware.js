const { body, validationResult } = require('express-validator');

exports.validateRegistration = [
  // Email is required for all users
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  // Password only required if user is not signing up with Google
  body('password')
    .custom((value, { req }) => {
      if (!req.body.googleId && (!value || value.length < 6)) {
        throw new Error('Password must be at least 6 characters (unless signing up with Google)');
      }
      return true;
    }),

  // Optional therapist fields
  body('role').optional().isIn(['patient', 'therapist']),
  body('name').optional().isString(),
  body('bio').optional().isString(),
  body('specialties').optional().isArray(),
  body('ratePerSession').optional().isNumeric(),
  body('currency').optional().isString(),
  body('availableHours').optional().isArray(),

  // Final validation handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateLogin = [
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format'),
  
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];