import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
.setName('ping')
.setDescription('Ping information (+ pong!)')

export async function execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    interaction.editReply(`Pong! :ping_pong:\nHeartb-b-b-beat: ʚ **${interaction.client.ws.ping}ms**\nRoundtrip: ʚ **${sent.createdTimestamp - interaction.createdTimestamp}ms**`);
}