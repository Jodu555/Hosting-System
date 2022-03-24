const { CommandManager, Command } = require('@jodu555/commandmanager');
const { encrypt } = require('./crypt');
const commandManager = CommandManager.getCommandManager();

const initialize = () => {

    commandManager.registerCommand(
        new Command(
            ['registerService', 'rs'], // The Command
            'registerService <TYPE> <IP>', // A Usage Info with arguments
            'Prints an ecrypted Service Info', // A Description what the command does
            (command, [_, type, ip], scope) => {

                const obj = { type, ip };

                const result = encrypt(JSON.stringify(obj));

                return [
                    'Generated Service Credentials: ',
                    '   IV: ' + result.iv,
                    '   CONTENT: ' + result.content
                ]
            }
        )
    );

}

module.exports = {
    initialize
}