import { REST, Routes } from 'discord.js';

import fs from 'fs';
import { pathToFileURL, fileURLToPath } from 'url';
import path from 'path';

import Logger from './utils/logger.js'; 
const logger = new Logger("registerslash", "fad870", 'client.utils')

import keys  from './data/keys.json' assert { type: "json" };

/* 
    Command Handling
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
let commands = []

async function getCommands() {
	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file)
			import(pathToFileURL(filePath)).then(command => {
				if ('data' in command && 'execute' in command) {
					console.log(`Detected command. Pushing... \n${JSON.stringify(command.data.toJSON())}`)
					commands.push(command.data.toJSON())
					console.log(`Done pushing. Here's the result: \n${JSON.stringify(commands)}`);
				} else {
					logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`, "client.commandHandler");
				}
			});
		}
	}
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(commands);
		  }, 2000);
	})
}

/*
    Registering commands.
*/

const rest = new REST().setToken(keys.discord.token);

(async () => {
	getCommands().then(async () => {
		try {
			logger.log(`Started refreshing ${commands.length} application (/) commands.`);
	
			const data = await rest.put(
				Routes.applicationGuildCommands(keys.discord.client, keys.discord.guild),
				{ body: commands },
			);
	
			logger.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			logger.error(error);
		}
	})
})();
