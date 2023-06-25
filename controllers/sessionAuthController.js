import { use } from 'bcrypt/promises.js'
import connect from '../database/index.js'
import AppError from '../utils/appError.js'
import catchAsync from '../utils/catchAsync.js'
import {hash, verify} from '../utils/password.js'

export const signup = catchAsync(async (req, res, next) => {
    //extract data from request body
    const {username, email, password} = req.body;
    if(!username || !email || !password) {
        return next(new AppError('please provide your username, email and  password', 400));
    }

    //hashing password
    const hashedPassword = await hash(password);

    //write it to db
    const conn = await connect();
    const sql = `
        insert into users(username, email, password)
        values (?, ?, ?)
    `;
    await conn.query(sql, [username, email, hashedPassword]);
    res.status(201).json({
        status: 'success',
        message: 'a new user created successfuly'
    })
})

export const login = catchAsync(async (req, res, next) => {
    //extract data from req body
    const {email, password} = req.body;
    if(!email || !password) {
        return next(new AppError('please provide your email and password', 400));
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

    req.session.user = user;

    res.status(200).json({
        status: 'success',
        data: {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        }
    })


})

export const isLoggedIn = catchAsync(async (req, res, next) => {
    if(!req.session || !req.session.user) {
        return next(new AppError('you are not logged in, please login to get access', 401))
    }

    next();
})

export const restrictTo = (...roles) => {
    return (req, res, next) => {
         if(!roles.includes(req.session.user.role)) {
             return next(new AppError('permission denied', 403))
         }
 
         next();
    }
 }

export const logout = catchAsync(async (req, res, next) => {
    req.session.destroy()

    res.status(200).json({
        status: 'success',
        message: 'you are logged out '
    })
})