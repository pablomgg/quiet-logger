import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import * as commands from './commands/index.js';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();
for (const [name, cmd] of Object.entries(commands)) {
  client.commands.set(cmd.data.name, cmd);
}

client.once(Events.ClientReady, () => {
  console.log(`✅ Bot logado como ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (command) await command.execute(interaction);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  const guildId = oldState.guild.id;
  const member = oldState.member;
  const displayName = member?.displayName; //pega o nome no servidor

  if (!oldState.channelId || newState.channelId) return;

  const config = JSON.parse(fs.readFileSync('./config.json'));
  const guildConfig = config[guildId];
  if (!guildConfig) return;

  console.log(member?.user.id);
  const isMonitoredChannel = guildConfig.voiceChannels?.includes(oldState.channelId);
  const isMonitoredMember = !Array.isArray(guildConfig.members)
      || guildConfig.members.length === 0
      || guildConfig.members.includes(member?.user.id);

  if (!isMonitoredChannel || !isMonitoredMember) return;

  try {
    const logChannel = await client.channels.fetch(guildConfig.logChannel);
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Cuiaba' });

    if (logChannel.isTextBased()) {
      await logChannel.send(`🔇 ${displayName} saiu do canal <#${oldState.channelId}> às ${timestamp}`);
    }
  } catch (err) {
    console.error('Erro ao enviar log:', err);
  }
});

client.login(process.env.DISCORD_TOKEN);