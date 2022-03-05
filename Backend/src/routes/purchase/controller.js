const { Database } = require('@jodu555/mysqlapi');
const KVM = require('../../classes/KVM');
const ProxmoxApi = require('../../proxmoxAPI/ProxmoxAPI');
const { getQueue } = require('../../utils/utils');
const database = Database.getDatabase();

const purchaseKVM = async (req, res, next) => {
    try {
        const validation = database.getSchema('purchaseKVM').validate(req.body, true);
        const { UUID, packageUUID } = validation.object;
        const package = await database.get('kvm_packages').getOne({ UUID: packageUUID });
        if (!package)
            throw new Error('This Package dont exists');
        if (package.cost > req.credentials.user.balance)
            throw new Error('You dont have enough Money');

        //Get Random Network
        const networks = await database.get('ips').get({ USED: 0 });
        const randomNetwork = networks[Math.floor(Math.random() * networks.length)];
        if (!randomNetwork)
            throw new Error(`No more free IP's`);

        // Balance Removing
        const userEndBalance = req.credentials.user.balance - package.cost;
        await database.get('accounts').update({ UUID: req.credentials.user.UUID }, { balance: userEndBalance });


        //Set Random Network USED
        // await database.get('ips').update({ UUID: randomNetwork.UUID }, { USED: 1 });

        const proxmoxAPI = new ProxmoxApi(process.env.URL + '/api2/json', {
            username: 'root@pam',
            password: process.env.PASSWORD
        })
        await proxmoxAPI.authenticate();
        const node = proxmoxAPI.getNode('ns3177623');

        const kvm = new KVM(101, {
            ip: randomNetwork.IP,
            mac: randomNetwork.VMAC,
            gateway: randomNetwork.GATEWAY,
            netmask: '255.255.255.255',
        }, {
            disk: package.storage,
            cores: package.cores,
            sockets: package.sockets,
            memory: package.memory,
        }, node);

        // kvm.create();

        getQueue().push({ action: 'CREATE-KVM', kvm });


        const kvmCP = { ...kvm };
        delete kvmCP.node;
        res.json({ kvmCP });


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