const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const KVM = require('./classes/KVM')

const { Database } = require('@jodu555/mysqlapi');
const database = Database.createDatabase(
    process.env.DB_HOST || 'localhost',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    process.env.DB_DATABASE || 'hostingsystem'
);
database.connect();

require('./database/tables')();


const authManager = require('./utils/authManager');
(async () => {
    authManager.addToken('SECRET-DEV-TOKEN', (await database.get('accounts').getOne({ UUID: 'a6e7ba88-53eb-4233-8789-691741583b3a' })))
})();





const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());


const { router: auth } = require('./routes/auth/index');
const { router: packages } = require('./routes/packages/index');
const { router: transactions } = require('./routes/transactions/index');
const { router: purchase } = require('./routes/purchase/index');

app.use('/auth', auth);
app.use('/packages', packages);
app.use('/transactions', authManager.authentication(), transactions);
app.use('/purchase', authManager.authentication(), purchase);


const { errorHandling, notFound } = require('./utils/middleware');
app.use('*', notFound);
app.use(errorHandling);



const { generateUUID, generatePassword } = require('./utils/crypt');
const { getProxmoxApi } = require('./utils/utils');

const PORT = process.env.PORT || 3100;
app.listen(PORT, async () => {
    console.log(`Express App is listening on ${PORT}`);



    console.log(await generatePassword());

    return;
    console.log('KVM-GS#' + generateUUID()); // Generated Services
    console.log('KVM-PS#' + generateUUID()); // Package Services

    const node = (await getProxmoxApi()).getNode('ns3177623');

    return;
    const kvm = new KVM(101, {
        ip: '141.95.120.229',
        mac: '02:00:00:9f:f0:98',
        gateway: '51.195.60.254',
        netmask: '255.255.255.255',
    }, {
        disk: 10,
        cores: 4,
        sockets: 4,
        memory: 5012,
    }, node);

    await kvm.create();


    // return;


    // node.getVM('100').resize({ size: '5G' })

    // console.log(await node.getVM(101).status.current());
    // console.log(await node.getVM(100).snapshot.create('ixi'));
    // console.log(await node.getVM(100).snapshot.get('ixi').rollback());


    // console.log(await node.information());

    // console.log(await proxmoxAPI.getNodeInformation('ns3177623'));
});