# Hosting-System

A Hosting-System

## Todo

- [x] Think about the role system to prevent bs package creation
- [ ] ProxmoxAPI
  - [ ] Move it to another git repo
  - [ ] Upload it to npm
  - [ ] maybe write a whole documentation

## ERM (Database Model)

![This is the basic DB model.](https://images.jodu555.de/66bdc0f86e16ecb9b672d98871fdf33a.png 'This is the db model till now.')

## Architecture Model

![This is the basic Architecture model.](https://images.jodu555.de/69974706ff4d13a6e8825c64b9e8e3d8.png 'This is the Architecture model till now.')

## Ideas

- Make a thing like task Queue where new orders gets placed so the server dont gets flud by too many orders
  maybe with a static iteration time
- Clarify the UUID's with there syntax like KVM-GS# where KVM stands for the type GS for GENerated services and the # is for the generation
- Types of servers:
  - PACKage Server : Pre defined servers
  - GENerated Server : User defined servers

## MVP - Minimum Viable Product

- [ ] Authentication
- [ ] Balance Increase
- [ ] Product Ordering

## Tech Stack

- Front-end: Vue.js + Vuex + Vue-Router + Bootstrap
- Other: MySql + Stripe + Socket.io
- Back-end: Node.js + Express + ProxmoxApi

## Notes

- All the Balance/Money Realted stuff gets stored as cents so \* 100 to get the corresponding € Value | It just makes the math so much easier

## API Route Todos

- [ ] All Routes are Prefixed with HOST/api/
- [x] /packages
  - [x] GET : Shows all packages
  - [x] POST : Creates a new package
- [x] /auth/info : Shows account info (Balance, Name, E-Mail)
- [x] /transactions : Shows all taken Transactions
  - [x] /:ID : Shows a particular transaction
- [ ] /products : Shows all Products
  - [ ] /:ID : Shows a particular Product
  - [ ] /service/:ID : Shows a particular Service (Backend decides from ID if GEN or PACK)

## VM Creation Steps

- **There Under me is so much bs it turns out it was so much harder then it is there**
- [x] Clone VM to x ID
- [x] Edit x VM to the new mac mem cpu disk
- [x] Configurate the internal file
- **But for me i let it stand their and write after this the real steps**
- [x] Clone Vm to x ID
- [x] Edit x VM to the specs
- [x] Start The VM
- [x] Wait for the vm to start
- [x] Prepare the local network file
- [x] Upload the local network file
- [x] Configure the new Mac Address
- [x] Start the VM up again
- [x] Delete the local network file
- [ ] Change the password

## Stugg ive found to intercept and manipulate minecraft packets

- https://wiki.vg/Protocol
- https://wiki.vg/Server_List_Ping#Examples_2
- https://wiki.vg/Server_List_Ping#Response
- https://www.spigotmc.org/threads/solved-nodejs-reading-and-responding-to-minecraft-packets.345741/
- https://www.spigotmc.org/threads/nodejs-responding-to-minecraft-ping-requests.346082/
- https://stackoverflow.com/questions/66357253/nodejs-parse-raw-minecraft-packet
- https://github.com/PrismarineJS/node-minecraft-protocol
- https://codebeautify.org/hex-string-converter
- https://github.com/0tii/Mc-Status/blob/master/mc-server-status.js
- https://www.reddit.com/r/admincraft/comments/cvaghq/decoding_and_encoding_minecraft_packets_c/ey6a3ez/

## Stretch

- [ ] Live Chat
- [ ] Ticket System
- [ ] PDF Invoice
