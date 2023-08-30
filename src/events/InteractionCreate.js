import { Events } from 'discord.js'
import Logger from '../utils/logger.js';
const logger = new Logger("client", "fabe89", "event.interactionCreate")

export const name = Events.InteractionCreate;

export async function execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		logger.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		logger.error(`Error executing ${interaction.commandName}`);
		logger.error(error);
	}
}