const { Database } = require('@jodu555/mysqlapi');
const database = Database.getDatabase();
const { generateUUID } = require('../../utils/crypt');

const list = async (req, res, next) => { //List Packages
    try {
        const response = await database.get('kvm_packages').get();
        res.json(response);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {


};


module.exports = {
    list,
    create,
}