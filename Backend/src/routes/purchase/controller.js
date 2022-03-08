const { Database } = require('@jodu555/mysqlapi');
const KVM = require('../../classes/KVM');
const { getRandomFromArray } = require('../../utils/crypt');
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


        //Set Random Network USED
        // await database.get('ips').update({ UUID: randomNetwork.UUID }, { USED: 1 });

        console.log(randomNetwork, package);

        const node = (await getProxmoxApi()).getNode(process.env.DEFAULT_NODE);

        const kvm = new KVM(getNextFreeVMID(node), {
            ip: randomNetwork.IP,
            mac: randomNetwork.VMAC,
            gateway: randomNetwork.GATEWAY,
            netmask: '255.255.255.255',
        }, {
            disk: package.storage,
            cores: package.cores,
            sockets: package.sockets,
            memory: package.memory,
        });

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

const getNextFreeVMID = async (node) => (await node.getVMStats()).map(e => Number(e.vmid)).sort().pop() + 1;


module.exports = {
    purchaseKVM,
    purchaseMC
}