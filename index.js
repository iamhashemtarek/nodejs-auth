// handling uncaught exception
process.on('uncaughtException', (err) => {
    console.log(`name: ${err.name}, message: ${err.message}`);
    console.log(('uncaughtException, shutting down'));
    process.exit(1);
})

import Express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv'
import session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import usersRoutes from './routes/usersRoutes.js'
import AppError from './utils/appError.js'
import globalErrorHandler from './middlewares/globalErrorHandler.js'
import cookieParser from 'cookie-parser';

const app = Express();

//dotenv config
dotenv.config({ path: './.env' })

//redis config
const redisClinet = createClient({
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT,
})
await redisClinet.connect().then(() => {
    console.log('connected to redis');
}).catch(() => {
    console.log('failed to connect to redis');
})



//middlewares
app.use(Express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(session({
    store: new RedisStore({client: redisClinet}),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: false, //true for production
        httpOnly: true,
        maxAge: 1000*60 //1min,
    }

}))

//routes
app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/auth', (req, res, next) => {
    req.session.isAuth= 2;
    res.status(200).json({
        status: 'success',
        data: {
            session: req.session || 'empty'
        }
    })
})
// 404 page 
app.all('*', (req, res, next) => {
    next(new AppError(`can't find this route ${req.originalUrl} on this server`, 404))
})
//global error handler
app.use(globalErrorHandler);

//start listeninig
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
})

// handling unhandled Rejections
process.on('unhandledRejection', (err) => {
    console.log(`name: ${err.name}, message: ${err.message}`);
    console.log(('unhandledRejection, shutting down'));
    server.close(() => {
        process.exit(1);
    })
})