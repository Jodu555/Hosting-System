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
    try {
        const validation = database.getSchema('createPackageSchema').validate(req.body, true);
        const package = validation.object;

        if (!await (database.get('kvm_packages').getOne({ name: package.name }))) {
            const response = database.get('kvm_packages').create(package);
            res.json(response);
        } else {
            next(new Error('A Package with that name already exists!'))
        }
    } catch (error) {
        next(error);
    }
};


module.exports = {
    list,
    create,
}