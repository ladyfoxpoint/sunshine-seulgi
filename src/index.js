import { Client, GatewayIntentBits, ActivityType, Collection, REST } from 'discord.js';

import fs from 'fs';
import { pathToFileURL, fileURLToPath } from 'url';
import path from 'path';

import Logger from './utils/logger.js'; 
import keys  from './data/keys.json' assert { type: "json" };

/* 
    Create the client object with set options
    (and logger instance too)
*/

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ],
    presence: {
        status: "online",
        activities: [{name: "o por do sol e batendo palminha 🤲", type: ActivityType.Watching}]
    }
});

const logger = new Logger("client", "fad870")


/* 
    Command Handling..?
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

let commands = []
client.commands = new Collection();
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
		import(pathToFileURL(filePath)).then(command => {
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON())
			} else {
				logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`, "client.commandHandler");
			}
		});
	}
}



/* 
    Event handling
*/

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	import(pathToFileURL(filePath)).then(event => {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    });
}


/*
    Client Login!
*/

client.login(keys.discord.token);