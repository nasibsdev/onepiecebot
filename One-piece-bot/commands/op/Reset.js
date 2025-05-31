const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const collectionFilePath = path.resolve(__dirname, "../../data/userCollection.json");
const currencyFilePath = path.resolve(__dirname, "../../data/userCurrency.json");
const statsFilePath = path.resolve(__dirname, "../../data/userStats.json");
const ownerId = "1257718161298690119"; // 👈 replace this with your Discord ID

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "reset",
  description: "Reset your collection or all collections (owner only)",
  async execute(message, args) {
    if (args[0] === "me") {
      const confirmRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("confirm_reset_me")
          .setLabel("Yes, reset my collection")
          .setStyle(ButtonStyle.Danger)
      );

      await message.reply({
        content: "⚠️ Are you sure you want to reset your collection, currency, and stats?",
        components: [confirmRow],
      });

      const filter = (i) => i.customId === "confirm_reset_me" && i.user.id === message.author.id;
      const collector = message.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

      collector.on("collect", (interaction) => {
        const userId = message.author.id;

        // Read all data
        const collection = readJSON(collectionFilePath);
        const currency = readJSON(currencyFilePath);
        const stats = readJSON(statsFilePath);

        // Delete user data
        delete collection[userId];
        delete currency[userId];
        delete stats[userId];

        // Write back updated data
        writeJSON(collectionFilePath, collection);
        writeJSON(currencyFilePath, currency);
        writeJSON(statsFilePath, stats);

        interaction.update({ content: "✅ Your collection, currency, and stats have been reset.", components: [] });
      });

    } else if (args[0] === "all") {
      if (message.author.id !== ownerId) {
        return message.reply("<:View_As_Role_Arrow:1375578241380651089> Only the bot owner can reset all users.");
      }

      const confirmRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("confirm_reset_all")
          .setLabel("Yes, reset ALL collections")
          .setStyle(ButtonStyle.Danger)
      );

      await message.reply({
        content: "<:arrow:1375872983029256303> Are you ABSOLUTELY sure you want to reset **everyone's** collection, currency, and stats?",
        components: [confirmRow],
      });

      const filter = (i) => i.customId === "confirm_reset_all" && i.user.id === message.author.id;
      const collector = message.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

      collector.on("collect", (interaction) => {
        // Reset all files to empty objects
        writeJSON(collectionFilePath, {});
        writeJSON(currencyFilePath, {});
        writeJSON(statsFilePath, {});

        interaction.update({ content: "<:sucess:1375872950321811547> All collections, currency, and stats have been reset.", components: [] });
      });
    } else {
      return message.reply("Usage: `!reset me` or `!reset all`");
    }
  },
};
