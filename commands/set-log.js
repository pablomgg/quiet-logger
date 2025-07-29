import fs from 'fs';
import { SlashCommandBuilder, ChannelType } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('set-log')
  .setDescription('Definir canal de log')
  .addChannelOption(opt =>
    opt.setName('canal')
      .setDescription('Canal de texto')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText));

export async function execute(interaction) {
  const config = JSON.parse(fs.readFileSync('./config.json'));

  if (!interaction.inGuild()) {
    return interaction.reply({
      content: '❌ Este comando só funciona dentro de servidores.',
      ephemeral: true
    });
  }

  const guildId = interaction.guildId;
  const canalId = interaction.options.getChannel('canal').id;

  if (!config[guildId]) config[guildId] = {};
  config[guildId].logChannel = canalId;

  fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
  await interaction.reply({ content: `📨 Canal de log definido: <#${canalId}>`, ephemeral: true });
}