# Discord Speech Recognition Extension

This is an extension for [discord.js](https://discord.js.org) library that makes creating discord speech recognition bots as easy as common text bots.

## Installation

**Discord.js v13**:

```
npm i discord-speech-recognition
```

Checkout simpleBot example in examples directory for ready-to-use bot.

**Discord.js v12**:

```
npm i discord-speech-recognition@1
```

You need also dependency for voice, recommended:

```
npm i @discordjs/opus
```

You can read more here: <https://discordjs.guide/voice/#installing-dependencies>

## Docs

<https://discordsr.netlify.app/>

## Example usage for discord.js v13

```javascript
const { Client, Intents } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { addSpeechEvent } = require("discord-speech-recognition");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});
addSpeechEvent(client);

client.on("messageCreate", (msg) => {
  const voiceChannel = msg.member?.voice.channel;
  if (voiceChannel) {
    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
    });
  }
});

client.on("speech", (msg) => {
  // If bot didn't recognize speech, content will be empty
  if (!msg.content) return;

  msg.author.send(msg.content);
});

client.on("ready", () => {
  console.log("Ready!");
});

client.login("token");

```

## Example usage for discord.js v14 using Wit.ai

```javascript
const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { addSpeechEvent, resolveSpeechWithWitai } = require("discord-speech-recognition");

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
  key: "key",
  ignoreBots: true
};

addSpeechEvent(client, options);

client.on("messageCreate", (msg) => {
  const voiceChannel = msg.member?.voice.channel;
  if (voiceChannel) {
    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
    });
  }
});

client.on("speech", (msg) => {
  // If bot didn't recognize speech, content will be empty
  if (!msg.content) return;

  msg.author.send(msg.content);
});

client.on("ready", () => {
  console.log("Ready!");
});

client.login("token");
