const { Database } = require('@jodu555/mysqlapi');
const database = Database.getDatabase();
const { generateUUID } = require('../../utils/crypt');

const list = async (req, res, next) => {
    try {
        const response = await database.get('transactions').get({ account_UUID: req.credentials.user.UUID, unique: true });
        res.json(response);
    } catch (error) {
        next(error);
    }
};

const showOne = async (req, res, next) => {
    try {
        const UUID = req.params.ID;
        const account_UUID = req.credentials.user.UUID;
        const response = await database.get('transactions').getOne({ account_UUID, UUID, unique: true });
        res.json(response);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    list,
    showOne
}