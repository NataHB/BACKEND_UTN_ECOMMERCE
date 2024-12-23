const errorHandlerMiddleware = (err, req, res, next) => {
    err.status_code = err.status_code || 500;
    err.status = err.status || "ERROR";

    if(err.is_operational) {
        res.json({
            status: err.status,
            message: err.message
        });
    }

    console.log('ERROR:', err);

    return res.status(500).json({
        status: 'ERROR',
        message: 'Nuestro error'
    });
};

export default errorHandlerMiddleware