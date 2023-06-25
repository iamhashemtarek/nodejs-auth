export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.statusCode || 'error';

    if(process.env.NODE_ENV == 'dev'){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err
        })
    }else if (process.env.NODE_ENV == 'prod'){
        if(err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        }else {
            res.status(500).json({
                status: 'error',
                message: 'somthing went wrong'
            })
        }
    }
}