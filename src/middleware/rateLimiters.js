import { rateLimit } from 'express-rate-limit';

  const sharedOptions = {
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      statusCode: 429,
      handler: (req, res, next, options) => {
        const error = new Error(options.message);
        error.status = options.statusCode;
        next(error);
      },
  };

  const loginLimiter = rateLimit({
      ...sharedOptions,
      windowMs: 15 * 60 * 1000,
      limit: 5,
      message: 'Too many login attempts. Please try again later',
  });

  const registrationLimiter = rateLimit({
      ...sharedOptions,
      windowMs: 60 * 60 * 1000,
      limit: 3,
      message: 'Too many registration attempts. Please try again later.',
  });

  export { loginLimiter, registrationLimiter };