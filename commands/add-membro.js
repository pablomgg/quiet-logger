import fs from 'fs';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('add-membro')
  .setDescription('Adicionar membro para monitoramento')
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

  if (!config[guildId]) config[guildId] = {};
  const members = config[guildId].members || [];
  if (!members.includes(userId)) members.push(userId);
  config[guildId].members = members;

  fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
  await interaction.reply({ content: `👤 Membro <@${userId}> adicionado à lista de monitoramento.`, ephemeral: true });
}