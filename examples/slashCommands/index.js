const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const { Client, GatewayIntentBits, GuildMember } = require("discord.js");
const { addSpeechEvent, resolveSpeechWithWitai } = require("discord-speech-recognition");
const {token, witaiKey} = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildVoiceStates, 
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
  ],
});

const options = {
  lang: "en-US",
  speechRecognition: resolveSpeechWithWitai,
  key: config.witaiKey,
  ignoreBots: true
};

addSpeechEvent(client, options);

client.on("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "join") {
    if (
      interaction.member instanceof GuildMember &&
      interaction.member.voice.channel
    ) {
      const channel = interaction.member.voice.channel;
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        selfDeaf: false,
        selfMute: true,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      await interaction.reply("Joined voice channel");
    } else {
      await interaction.reply("Join a voice channel and then try that again!");
    }
  }
  if (commandName === "leave") {
    const connection = getVoiceConnection(interaction.guildId);
    if (connection) {
      connection.destroy();
      await interaction.reply("Left voice channel");
    } else {
      await interaction.reply("Bot isn't in voice channel!");
    }
  }
});

client.on("speech", (msg) => {
  if (!msg.content) return;

  msg.author.send(msg.content);
});

client.login(token);

