import { Events } from 'discord.js'
import Logger from '../utils/logger.js';
const logger = new Logger("client", "fabe89", "event.clientReady")

export const name = Events.ClientReady;
export const once = true;

export function execute(client) {
    logger.log(` ready to have a suntastic day! ʚ${logger.bold(client.user.tag)}ɞ`);
}