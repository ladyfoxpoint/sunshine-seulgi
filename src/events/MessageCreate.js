import { Events, EmbedBuilder, ButtonBuilder, ActionRowBuilder } from 'discord.js';

import { Spotify } from '../utils/spotify.js'

import config from '../data/config.json' assert { type: "json" }
import Logger from '../utils/logger.js';
const logger = new Logger("client.events", "fabe89", "MessageCreate");

export const name = Events.MessageCreate;

export async function execute(interaction) {
    // Check if bot and if not in correct channel.
    if (interaction.author.bot) return;
    if (!config.client.channels.includes(interaction.channelId)) return;

    // Check if spotify link.
    if (/https:\/\/open\.spotify\.com/i.test(interaction.content)) {
        //Spawn spotify api.
        const spotify = new Spotify();

        //Parse query.
        let result = await spotify.parseQuery(interaction.content);
        if (!result) {interaction.reply("Something went wrong while parsing this link! **(result_empty)**"); return;}

        // Embed base.
        const embed = new EmbedBuilder()
        .setColor(16439408)
        .setAuthor({name: 'Spotify', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Spotify_App_Logo.svg/2048px-Spotify_App_Logo.svg.png'})
        .setFooter({ text: ' brought to you by: sunshine seulgi ☀️┆ with ♡ for clv!', iconURL: 'https://cdn.discordapp.com/avatars/1115339863055679538/d0708d465320175d2cdf6ca56526b18d.png'})

        // Make buttons.
        const playButton = new ButtonBuilder()
        .setCustomId('play')
        .setLabel('▶ Add to queue')
        .setStyle('Success')

        const playTopButton = new ButtonBuilder()
        .setCustomId('playTop')
        .setLabel('▲ Top of queue')
        .setStyle('Primary')

        const replaceQueue = new ButtonBuilder()
        .setCustomId('replaceQueue')
        .setLabel('▼ Replace queue')
        .setStyle('Secondary')

        const actionRow = new ActionRowBuilder()
        .addComponents(playButton, playTopButton, replaceQueue);


        // Type specific rest of embed.
        if (result['type'] == "track") {
            embed.setTitle(result['name'])
            .setURL(result['url'])
            .setDescription(`₊ ⊹ **Artist(s)**: ${result['tracks'][0]['artist']}\n₊ ⊹ **Release Date**: ${result['tracks'][0]['release']}\n ₊ ⊹ **Duration**: ${result['tracks'][0]['duration']}`)
            .setThumbnail(result['thumbnail'])
        }
        else {
            embed.setTitle(result['name'])
            .setURL(result['url'])
            .setDescription( ((result) => {
                let desc = "";
                for (let [i, item] of result['tracks'].entries()) {
                    if (i > 5) { 
                        desc = desc + `₊ ⊹ ${item['name']}┆(${item['duration']})  **(...)**`; 
                        return desc;
                    }
                    desc = desc + `₊ ⊹ ${item['name']}┆(${item['duration']})\n`;
                }
                return desc;
            })(result))
            //.setDescription(result['tracks'])
            .setThumbnail(result['thumbnail'])
        }

        await interaction.channel.send({ embeds: [embed], components: [actionRow] });
        await interaction.delete();

        return;
    }
}