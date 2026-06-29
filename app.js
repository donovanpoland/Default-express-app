/** 
  * app.js builds and configures the Express application. It exports the app without
  * starting a server, which keeps routing, middleware, and view setup separate from runtime startup.
**/

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './src/routes.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';
import flash from './src/middleware/flashMiddleware.js';
import sessionMiddleware from './src/config/session.js';
import { siteConfig } from './src/config/site.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const NODE_ENV = process.env.NODE_ENV || 'production';
const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS ?? 0);
if (NODE_ENV === 'production' && trustProxyHops > 0) {
  app.set('trust proxy', trustProxyHops);
}

app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.locals.site = siteConfig;

// se sessions for users
app.use(sessionMiddleware);

// set is logged in status as a local variable
app.use((req, res, next) => {
  res.locals.isLoggedIn = Boolean(req.session?.user);
  res.locals.user = req.session?.user ?? null;
  next();
});
// set flash middleware
app.use(flash);

// Middleware to make NODE_ENV available to all templates
// check if the user is logged in and make session true
app.use((req, res, next) => {
    res.locals.isLoggedIn = false;
        if (req.session && req.session.user) {
            res.locals.isLoggedIn = true;
        }
    
    res.locals.user = req.session.user || null;

    res.locals.NODE_ENV = NODE_ENV;
    next();// Pass control to the next middleware or route
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', routes);

//errors
app.use(notFound);
app.use(errorHandler);

export default app;
