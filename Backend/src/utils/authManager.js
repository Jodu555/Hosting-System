const tokens = new Map();

function addToken(token, user) {
    tokens.forEach((value, key) => {
        if (JSON.stringify(value) == JSON.stringify(user)) {
            tokens.delete(key);
        }
    });
    tokens.set(token, user);
}

function removeToken(token) {
    tokens.delete(token);
}

function getUser(token) {
    return tokens.get(token);
}

function authentication(req, res, next) {
    authenticationFull(req, res, next);
}

function authenticationFull(req, res, next, cb) {
    const token = req.headers['auth-token'];
    if (token) {
        if (getUser(token)) {
            const user = getUser(token);
            if (cb(user)) {
                req.credentials = {
                    token,
                    user,
                };
                next();
            } else {
                next(new AuthenticationError('Insufficent Permission'))
            }
        } else {
            next(new AuthenticationError('Invalid auth-token'))
        }
    } else {
        next(new AuthenticationError('Missing auth-token in headers'));
    }
}

class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    addToken,
    removeToken,
    getUser,
    authentication,
    authenticationFull,
    AuthenticationError,
};
