const ProxmoxAPI = require('./proxmoxAPI/ProxmoxAPI')
const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const KVM = require('./KVM')

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

app.use('/auth', auth);
app.use('/packages', packages);
app.use('/transactions', authManager.authentication(), transactions);


const { errorHandling, notFound } = require('./utils/middleware');
app.use('*', notFound);
app.use(errorHandling);



const { generateUUID } = require('./utils/crypt');

const PORT = process.env.PORT || 3100;
app.listen(PORT, async () => {
    console.log(`Express App is listening on ${PORT}`);

    return;
    console.log('KVM-GS#' + generateUUID()); // Generated Services
    console.log('KVM-PS#' + generateUUID()); // Package Services

    // const kvm = new KVM(100, {
    //     ip: '127.0.0.1',
    //     mac: 'your-fictional-mac-addr',
    //     gateway: null,
    //     netmask: null,
    // }, {
    //     disk: 5,
    //     cores: 3,
    //     sockets: 3,
    //     memory: 5012,
    // });

    // kvm.prepareFile();

    // console.log(kvm);


    return;
    const proxmoxAPI = new ProxmoxAPI(process.env.URL + '/api2/json', {
        username: 'root@pam',
        password: process.env.PASSWORD
    })

    await proxmoxAPI.authenticate();

    const node = proxmoxAPI.getNode('ns3177623');

    // node.getVM('100').resize({ size: '5G' })

    // console.log(await node.getVM(101).status.current());
    // console.log(await node.getVM(100).snapshot.create('ixi'));
    // console.log(await node.getVM(100).snapshot.get('ixi').rollback());


    // console.log(await node.information());

    // const template = node.getVM(100);
    // await template.clone({
    //     newid: 101,
    //     full: true // So the storage is independent
    // });

    // const newVM = node.getVM(101);
    // await newVM.configurate({
    //     name: 'Test-API',
    //     // ide2: 'local:iso/debian-10.11.0-amd64-netinst.iso',
    //     cores: 4,
    //     sockets: 4,
    //     memory: 6024,
    //     net0: 'virtio=02:00:00:01:c6:6b,bridge=vmbr0,firewall=1',
    //     // scsi0: 'local:32,format=qcow2'
    // })
    // await newVM.configurate({
    //     scsi0: 'local:32,format=qcow2'
    // })

    // console.log(await proxmoxAPI.getNodeInformation('ns3177623'));

    const newVM = node.getVM(100);
    await newVM.create({
        name: 'Template',
        vmid: 100,
        ide2: 'local:iso/debian-10.11.0-amd64-netinst.iso,media=cdrom',
        cores: 2,
        sockets: 2,
        memory: 4048,
        net0: 'virtio=02:00:00:01:c6:6b,bridge=vmbr0,firewall=1',
        scsi0: 'local:3,format=qcow2'
    });


    const kvmPackages = [
        {
            ID: '01233448',
            name: '',
            cores: 1,
            memory: 1,
            disk: 10
        }
    ]
});