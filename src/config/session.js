import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "../database/pool.js";


const PgSession = connectPgSimple(session);

const sessionMiddleware = session({
    store: new PgSession({
        pool,
        tableName: "sessions"
    }),

    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    cookie: {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60
    },
});

export default sessionMiddleware;