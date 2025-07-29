import fs from 'fs';
import { SlashCommandBuilder, ChannelType } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('remove-voz')
  .setDescription('Remover canal de voz monitorado')
  .addChannelOption(opt =>
    opt.setName('canal')
      .setDescription('Canal de voz')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildVoice));

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

  if (config[guildId]?.voiceChannels) {
    config[guildId].voiceChannels = config[guildId].voiceChannels.filter(id => id !== canalId);
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
  }

  await interaction.reply({ content: `🚫 Canal <#${canalId}> removido da lista.`, ephemeral: true });
}