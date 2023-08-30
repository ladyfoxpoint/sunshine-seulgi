import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
.setName('hello')
.setDescription('says hello :)')

export async function execute(interaction) {
    interaction.reply(`hi!`);
}