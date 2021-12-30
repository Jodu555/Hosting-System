const { Database } = require('@jodu555/mysqlapi');
const database = Database.getDatabase();
const { generateUUID } = require('../../utils/crypt');

const list = async (req, res, next) => {
    try {
        const response = await database.get('transactions').get();
        res.json(response);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    list,
}