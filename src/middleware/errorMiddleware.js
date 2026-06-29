import { pageMeta } from '../config/pageMeta.js';

const notFound = (req, res, next) => {
  const error = new Error(`Not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const supportedStatusCodes = new Set([404, 429]);
  const statusCode = supportedStatusCodes.has(error.status)
      ? error.status
      : 500;
  const view = `errors/${statusCode}`;
  const meta = pageMeta[statusCode];
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (statusCode === 500) {
    console.error(error);
  }

  return res.status(statusCode).render(view, {
    ...meta,
    isDevelopment,
    error: isDevelopment ? error.message : null,
    stack: isDevelopment ? error.stack : null,
  });
};


export { notFound, errorHandler };
