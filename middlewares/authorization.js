import AppError from '../utils/appError.js'

export const restrictTo = (...roles) => {
    return (req, res, next) => {
         if(!roles.includes(req.session.user.role)) {
             return next(new AppError('permission denied', 403))
         }
 
         next();
    }
 }