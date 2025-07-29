import fs from 'fs';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('listar-config')
  .setDescription('Listar configuração atual');

export async function execute(interaction) {
  const config = JSON.parse(fs.readFileSync('./config.json'));

  if (!interaction.inGuild()) {
    return interaction.reply({
      content: '❌ Este comando só funciona dentro de servidores.',
      ephemeral: true
    });
  }

  const guildId = interaction.guildId;
  const guildConfig = config[guildId];

  if (!guildConfig) {
    return await interaction.reply({ content: '❌ Nenhuma configuração encontrada.', ephemeral: true });
  }

  const canais = guildConfig.voiceChannels?.map(id => `<#${id}>`).join(', ') || 'Nenhum';
  const membros = guildConfig.members?.map(id => `<@${id}>`).join(', ') || 'Todos';
  const log = guildConfig.logChannel ? `<#${guildConfig.logChannel}>` : 'Não definido';

  const msg = `🛠️ **Configuração atual:**
📨 Canal de log: ${log}
🔊 Canais de voz: ${canais}
👥 Membros monitorados: ${membros}`;
  await interaction.reply({ content: msg, ephemeral: true });
}