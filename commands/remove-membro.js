import fs from 'fs';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('remove-membro')
  .setDescription('Remover membro do monitoramento')
  .addUserOption(opt =>
    opt.setName('usuario')
      .setDescription('Membro do servidor')
      .setRequired(true));

export async function execute(interaction) {
  const config = JSON.parse(fs.readFileSync('./config.json'));

  if (!interaction.inGuild()) {
    return interaction.reply({
      content: '❌ Este comando só funciona dentro de servidores.',
      ephemeral: true
    });
  }

  const guildId = interaction.guildId;
  const userId = interaction.options.getUser('usuario').id;

  if (config[guildId]?.members) {
    config[guildId].members = config[guildId].members.filter(id => id !== userId);
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
  }

  await interaction.reply({ content: `🚫 Membro <@${userId}> removido da lista.`, ephemeral: true });
}