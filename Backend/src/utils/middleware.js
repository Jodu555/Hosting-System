const { AuthenticationError } = require('./authManager');

const { Database } = require('@jodu555/mysqlapi');
const database = Database.getDatabase();

function notFound(req, res) {
    throw new Error('notFound')
}

function errorHandling(err, req, res, next) {
    const error = {
        message: err.stack.split('\n')[0],
        stack: err.stack,
    };
    let status = 500;
    if (error instanceof AuthenticationError)
        status = 401;

    if (error instanceof database.ParsingError)
        status = 422;

    if (process.env.NODE_ENV !== 'production') {
        if (error.message.includes('notFound')) {
            res.status(404).send({
                success: false,
                path: req.path,
                message: 'Route not Found!',
            });
        } else {
            res.status(status).send({
                success: false,
                method: req.method,
                path: req.path,
                error,
            });
        }
    } else {
        res.status(status).send({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {
    notFound,
    errorHandling,
}