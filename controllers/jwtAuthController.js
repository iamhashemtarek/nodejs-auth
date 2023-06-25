import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import connect from '../database/index.js'
import {hash, verify} from '../utils/password.js'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import { log } from 'console'
import exp from 'constants'

export const login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return next(new AppError('please provide your email and password', 400))
    }

    const conn = await connect();
    const sql = `
        select id, username, email, password, role
        from users
        where email = ?
    `;
    const [[user]] = await conn.query(sql, [email])

    if(!user || !(await verify(password, user.password))) {
        return next(new AppError('incorrect email or password', 401))
    }

    //jwt config
    const payload = {
        userId: user.id
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 60 * 3//sec
    })


    //sent it via cookie
    res.cookie('jwt', token, {
        maxAge: 1000 * 60 * 3 , //ms
        secure: false, //true in case of prod
        httpOnly: true,
    })

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })

})

export const isLoggedIn = catchAsync(async (req, res, next) => {

    if(req.cookies.jwt) {

        const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET)

        //check if user still exist
        const conn = await connect();
        const sql = `
        select id, username, email, password, role
        from users
        where id = ?
        `;
        const [[user]] = await conn.query(sql, [decoded.userId])


        if(!user) {
            return next(new AppError( "the user belonging to this token does no longer exist.",
            401))
        }

        //save current user to req
        req.user = user;
        next()
    } 
})

export const restrictTo = (...roles) => {
    return (req, res, next) => {
         if(!roles.includes(req.user.role)) {
             return next(new AppError('permission denied', 403))
         }
 
         next();
    }
 }