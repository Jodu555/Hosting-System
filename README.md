# Hosting-System
A Hosting-System

## Thoughts
Maybe bring this ProxMox API to public cause the public ones are not THAT great 

## Todo
* [ ] Think about the role system to prevent bs package creation
* [ ] ProxmoxAPI
    * [ ] Move it to another git repo
    * [ ] Upload it to npm
    * [ ] maybe write a whole documentation

## ERM (Database Model)
![This is the basic DB modeling.](https://images.jodu555.de/0daf05971699fd394b1c9c632d7b8b2b.png "This is the db model till now.")

## Ideas
* Make a thing like task Queue where new orders gets placed so the server dont gets flud by too many orders 
    maybe with a static iteration time
* Clarify the UUID's with there syntax like KVM-GS# where KVM stands for the type GS for GENerated services and the # is for the generation
* Types of servers:
    * PACKage Server : Pre defined servers
    * GENerated Server : User defined servers 

## API Route Ideas
* All Routes are Prefixed with HOST/api/
* /packages : Shows all the available Packages
* /account : Shows account info (Balance, Name, E-Mail)
* /transactions : Shows all taken Transactions
    * /:ID : Shows a particular transaction
* /products : Shows all Products
    * /:ID : Shows a particular Product
    * /service/:ID : Shows a particular Service (Backend decides from ID if GEN or PACK)


## VM Creation Steps
* [ ] Clone VM to x ID
* [ ] Edit x VM to the new mac mem cpu disk
* [ ] Configurate the internal file
