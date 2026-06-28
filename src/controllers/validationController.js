import { body, validationResult} from 'express-validator';

// middleware factory function for validating errors
const handleValidationErrors = (
  redirectPath,
  fieldsToPreserve = [],
) => {
  return (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    errors.array().forEach(({ msg }) => {
      req.flash('warning', msg);
    });
    const destination =
      typeof redirectPath === 'function'
        ? redirectPath(req)
        : redirectPath;
    const formData = Object.fromEntries(
      fieldsToPreserve.map((field) => [
        field,
        req.body[field] ?? '',
      ]),
    );
    req.session.formData = formData;
    return res.redirect(303, destination);
  };
};



const userValidation = [
    body('fname')
        .trim()
        .notEmpty()
        .withMessage('First Name required')
        .isLength({max: 100})
        .withMessage('First name must be no more than 100 characters'),
    body('lname')
        .trim()
        .notEmpty()
        .withMessage('Last Name required')
        .isLength({max: 100})
        .withMessage('Last name must be no more than 100 characters'),
    body('email')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required')
        .isLength({ max: 255 })
        .withMessage('Email cannot exceed 255 characters')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({min: 8, max: 72})
        .withMessage('Password must be between 8 and 72 characters long'),
    body('confirmPassword')
        .notEmpty()
        .withMessage('Please confirm password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];// end user validation

const loginValidation = [
    body('email')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];// end login validation

const userEditValidation = [
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First Name required')
        .isLength({max: 100})
        .withMessage('First name must be no more than 100 characters'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last Name required')
        .isLength({max: 100})
        .withMessage('Last name must be no more than 100 characters'),
    body('userEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required')
        .isLength({ max: 255 })
        .withMessage('Email cannot exceed 255 characters')
        .isEmail()
        .withMessage('Please provide a valid email address'),
];// end user validation

// export users
export {
  userValidation,
  loginValidation,
  userEditValidation,
  handleValidationErrors,
};