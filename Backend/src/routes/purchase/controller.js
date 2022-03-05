const { Database } = require('@jodu555/mysqlapi');
const database = Database.getDatabase();
const { generateUUID } = require('../../utils/crypt');

const purchaseKVM = (req, res, next) => {
    try {
        const validation = database.getSchema('purchaseKVM').validate(req.body, true);
        const { UUID, packageUUID } = validation.object;



    } catch (error) {
        next(error);
    }


};
const purchaseMC = (req, res, next) => {

};

module.exports = {
    purchaseKVM,
    purchaseMC
}