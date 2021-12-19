const { Database } = require('@jodu555/mysqlapi');
const database = Database.getDatabase();
const authManager = require('../../utils/authManager');
const bcrypt = require('bcryptjs');

const register = async (req, res, next) => {
    try {
        const validation = database.getSchema('registerSchema').validate(req.body, true);
        const user = validation.object

        const search = { ...user }; //Spreading to disable the reference
        delete search.password;
        search.unique = false;
        const result = await database.get('accounts').get(search);
        if (result.length == 0) {
            user.password = await bcrypt.hash(user.password, 8);
            await database.get('accounts').create(user);

            delete user.password;
            res.json(user);
        } else {
            next(new Error('The email or the username is already taken!'));
        }
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const validation = database.getSchema('loginSchema').validate(req.body, true);
        const user = validation.object;
        const result = await database.get('accounts').get({ username: user.username, unique: true });
        if (result.length > 0) {
            if (await bcrypt.compare(user.password, result[0].password)) {
                const token = v4();
                delete result[0].password;
                authManager.addToken(token, result[0]);
                res.json({ token });
            } else {
                next(new Error('Invalid password!'));
            }
        } else {
            const value = user.username ? 'username' : 'email';
            next(new Error('Invalid ' + value + '!'));
        }
    } catch (error) {
        next(error);
    }

};

const logout = async (req, res, next) => {
    const token = req.credentials.token;
    authManager.removeToken(token);
    res.json({ message: 'Successfully logged out!' });
};


module.exports = {
    register,
    login,
    logout
}