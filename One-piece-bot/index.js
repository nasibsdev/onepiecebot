// Minimal server to keep Render pinging your app and keep it alive 24/7
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('One Piece Bot is alive!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌊 Server running on port ${PORT} - keeping bot alive!`);
});

const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildModeration,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands/op");
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
      const command = require(filePath);
      if (command && command.name) {
        client.commands.set(command.name.toLowerCase(), command);
        console.log(`✅ Loaded command: ${command.name}`);
      } else {
        console.warn(`⚠️ Skipping command "${file}" - missing a valid name.`);
      }
    } catch (err) {
      console.error(`❌ Failed to load command "${file}":`, err);
    }
  }
} else {
  console.warn("⚠️ Commands folder 'commands/op' does not exist.");
}

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const prefix = "op ";
  if (!message.content.toLowerCase().startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) {
    return message.channel.send(
      "<:arrow:1375872983029256303> Unknown command. Try **op help** if you're lost."
    );
  }

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(`<:arrow:1375872983029256303> Error executing command ${commandName}:`, error);
    message.channel.send("<:arrow:1375872983029256303> An error occurred while executing the command.");
  }
});

// InteractionCreate event for buttons and other interactions
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const fightCommand = client.commands.get("fight");
  if (fightCommand && typeof fightCommand.handleButton === "function") {
    try {
      await fightCommand.handleButton(interaction);
    } catch (error) {
      console.error("❌ Error handling button interaction in fight.js:", error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: "❌ Error processing button.", ephemeral: true });
      }
    }
  }
});

// Login your bot
client.login(process.env.TOKEN);
