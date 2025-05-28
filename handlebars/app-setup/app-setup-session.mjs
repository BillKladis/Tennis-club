import session from 'express-session'
import dotenv from 'dotenv'
dotenv.config();

export const sessionMiddleware = session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: true,

   cookie: { 
      maxAge: 1000 * 60 * 60 * 2,
   },
})
