const { Database } = require('@jodu555/mysqlapi');
const database = Database.getDatabase();

const list = async (req, res, next) => {
    try {
        const response = database.get('kvm_packages').get({});
        res.json(response);
    } catch (error) {
        next(error);
    }
};



module.exports = {
    list
}