const { Database } = require('@jodu555/mysqlapi');
const KVM = require('../../classes/KVM');
const { getRandomFromArray, generateUUID } = require('../../utils/crypt');
const { getQueue, getProxmoxApi } = require('../../utils/utils');
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
        const randomNetwork = getRandomFromArray(await database.get('ips').get({ USED: 0 }))
        if (!randomNetwork)
            throw new Error(`No more free IP's`);

        // Balance Removing
        const userEndBalance = req.credentials.user.balance - package.cost;
        await database.get('accounts').update({ UUID: req.credentials.user.UUID }, { balance: userEndBalance });


        //TODO: IMPORTANT: Set Random Network USED
        // await database.get('ips').update({ UUID: randomNetwork.UUID }, { USED: 1 });

        const VM_ID = await getNextFreeVMID(
            (await getProxmoxApi()).getNode(process.env.DEFAULT_NODE)
        );

        const service_UUID = generateUUID()
        const product_UUID = generateUUID();


        await database.get('products').create({
            UUID: product_UUID,
            account_UUID: req.credentials.user.UUID,
            cost: package.cost,
            name: 'Default-KVM-Package-Name'
        });

        await database.get('kvm_package_services').create({
            UUID: service_UUID,
            product_UUID,
            ip_UUID: randomNetwork.UUID,
            package_UUID: packageUUID,
            pve_ID: VM_ID,
        });

        await database.get('products').update({ UUID: product_UUID }, { service_UUID });


        const kvm = new KVM(VM_ID, {
            ip: randomNetwork.IP,
            mac: randomNetwork.VMAC,
            gateway: randomNetwork.GATEWAY,
            netmask: '255.255.255.255',
        }, {
            disk: package.storage,
            cores: package.cores,
            sockets: package.sockets,
            memory: package.memory,
        }, service_UUID);

        getQueue().push({ action: 'CREATE-KVM', kvm });

        // Unused, cause the node gets added in the queue
        // const kvmCP = { ...kvm };
        // delete kvmCP.node;
        res.json({ kvm });
    } catch (error) {
        next(error);
    }


};
const purchaseMC = (req, res, next) => {

};

const purchaseTS3Bot = (req, res, next) => {

};

const getNextFreeVMID = async (node) => (await node.getVMStats()).map(e => Number(e.vmid)).sort().pop() + 1;


module.exports = {
    purchaseKVM,
    purchaseMC,
    purchaseTS3Bot
}