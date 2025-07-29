import { REST, Routes, SlashCommandBuilder, ChannelType } from 'discord.js';
import { config } from 'dotenv';

config();

const commands = [
  new SlashCommandBuilder().setName('add-voz').setDescription('Adicionar canal de voz para monitorar')
    .addChannelOption(opt => opt.setName('canal').setDescription('Canal de voz').setRequired(true).addChannelTypes(ChannelType.GuildVoice)),
  new SlashCommandBuilder().setName('remove-voz').setDescription('Remover canal de voz monitorado')
    .addChannelOption(opt => opt.setName('canal').setDescription('Canal de voz').setRequired(true).addChannelTypes(ChannelType.GuildVoice)),
  new SlashCommandBuilder().setName('set-log').setDescription('Definir canal de log')
    .addChannelOption(opt => opt.setName('canal').setDescription('Canal de texto').setRequired(true).addChannelTypes(ChannelType.GuildText)),
  new SlashCommandBuilder().setName('add-membro').setDescription('Adicionar membro para monitoramento')
    .addUserOption(opt => opt.setName('usuario').setDescription('Membro do servidor').setRequired(true)),
  new SlashCommandBuilder().setName('remove-membro').setDescription('Remover membro do monitoramento')
    .addUserOption(opt => opt.setName('usuario').setDescription('Membro do servidor').setRequired(true)),
  new SlashCommandBuilder().setName('listar-config').setDescription('Listar configuração atual')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log('📡 Registrando comandos...');
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );

  //Para produção, usar o applicationCommands que recebe apenas o CLIENT_ID, porem a propagação apos o deploy
  //pode demorar até 1 hora. Para desenvolvimento e teste use o metodo de cima (applicationGuildCommands)
  // await rest.put(
  //     Routes.applicationCommands(process.env.CLIENT_ID),
  //     { body: commands }
  // );
  console.log('✅ Comandos registrados!');
} catch (err) {
  console.error(err);
}