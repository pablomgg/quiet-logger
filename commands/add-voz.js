import fs from 'fs';
import { SlashCommandBuilder, ChannelType } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('add-voz')
  .setDescription('Adicionar canal de voz para monitorar')
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

  if (!config[guildId]) config[guildId] = {};
  const canais = config[guildId].voiceChannels || [];
  if (!canais.includes(canalId)) canais.push(canalId);
  config[guildId].voiceChannels = canais;

  fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
  await interaction.reply({ content: `✅ Canal <#${canalId}> adicionado!`, ephemeral: true });
}