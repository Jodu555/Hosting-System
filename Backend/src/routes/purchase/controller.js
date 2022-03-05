const { Database } = require('@jodu555/mysqlapi');
const KVM = require('../../classes/KVM');
const ProxmoxApi = require('../../proxmoxAPI/ProxmoxAPI');
const database = Database.getDatabase();
const { generateUUID } = require('../../utils/crypt');

const purchaseKVM = async (req, res, next) => {
    try {
        const validation = database.getSchema('purchaseKVM').validate(req.body, true);
        const { UUID, packageUUID } = validation.object;
        const package = await database.get('kvm_packages').getOne({ UUID: packageUUID });
        if (!package)
            throw new Error('This Package dont exists');
        if (package.cost > req.credentials.user.balance)
            throw new Error('You dont have enough Money');

        //Balance Removing
        const userEndBalance = req.credentials.user.balance - package.cost;
        await database.get('accounts').update({ UUID: req.credentials.user.UUID }, { balance: userEndBalance });


        const proxmoxAPI = new ProxmoxApi(process.env.URL + '/api2/json', {
            username: 'root@pam',
            password: process.env.PASSWORD
        })
        await proxmoxAPI.authenticate();
        const node = proxmoxAPI.getNode('ns3177623');

        const kvm = new KVM(101, {
        }, {
            disk: package.storage,
            cores: package.cores,
            sockets: package.sockets,
            memory: package.memory,
        }, node);

        // await kvm.create();


        res.json({ 'WORKS': true })


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