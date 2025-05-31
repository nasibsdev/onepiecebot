const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const fs = require("fs");
const path = require("path");

const collectionFilePath = path.resolve(__dirname, "../../data/userCollection.json");

const rarityColors = {
  C: "#1F8B4C",
  B: "#2874A6",
  A: "#49326B",
  S: "#F1C40F",
  SS: "#E67E22",
  UR: "#C0392B",
  Z: "#8B0000"
};

const MAX_STORAGE = 250;

function readCollection() {
  if (!fs.existsSync(collectionFilePath)) return {};
  try {
    const data = fs.readFileSync(collectionFilePath, "utf8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

module.exports = {
  name: "collection",
  description: "View your card collection",
  async execute(message, args) {
    const userId = message.author.id;
    const collection = readCollection();

    if (!collection[userId] || Object.keys(collection[userId]).length === 0) {
      return message.channel.send("<:arrow:1375872983029256303> You have no cards in your collection.");
    }

    let filterRank = null;
    if (args.length > 0) {
      const rank = args[0].toUpperCase();
      if (!["C", "B", "A", "S", "SS", "UR", "Z"].includes(rank)) {
        return message.channel.send("<:arrow:1375872983029256303> **Invalid rarity!** Use C, B, A, S, SS, UR, or Z.");
      }
      filterRank = rank;
    }

    let userCards = Object.entries(collection[userId])
      .filter(([name, card]) => !filterRank || card.rank === filterRank)
      .map(([name, card]) => ({ name, ...card }));

    if (userCards.length === 0) {
      return message.channel.send(`<:arrow:1375872983029256303> You have no cards of rank **${filterRank}**.`);
    }

    if (filterRank) {
      userCards.sort((a, b) => (b.pulls ?? 1) - (a.pulls ?? 1));
    } else {
      userCards.sort((a, b) => (b.power ?? 0) - (a.power ?? 0));
    }

    const userStorage = Object.values(collection[userId]).reduce((sum, card) => sum + (card.pulls ?? 1), 0);

    let currentIndex = 0;

    function createEmbed(index) {
      const card = userCards[index];
      return new EmbedBuilder()
        .setTitle(`${card.name} (${card.rank})`)
        .setDescription(`**Pulls:** ${card.pulls ?? 1}`)
        .setColor(rarityColors[card.rank] || "#ffffff")
        .setImage(card.image || null)
        .setFooter({ text: `Card ${index + 1} of ${userCards.length}` });
    }

    const prevButton = new ButtonBuilder()
      .setCustomId("prev")
      .setLabel("◀ Previous")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true);

    const nextButton = new ButtonBuilder()
      .setCustomId("next")
      .setLabel("Next ▶")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(userCards.length === 1);

    const storageButton = new ButtonBuilder()
      .setCustomId("storage")
      .setLabel(`Storage: ${userStorage} / ${MAX_STORAGE}`)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    let row = new ActionRowBuilder().addComponents(prevButton, storageButton, nextButton);

    const msg = await message.channel.send({ embeds: [createEmbed(currentIndex)], components: [row] });

    if (userCards.length === 1) return;

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000
    });

    collector.on("collect", async interaction => {
      if (interaction.user.id !== userId) {
        return interaction.reply({ content: "<:arrow:1375872983029256303> These buttons aren't for you!", ephemeral: true });
      }

      if (interaction.customId === "prev" && currentIndex > 0) currentIndex--;
      else if (interaction.customId === "next" && currentIndex < userCards.length - 1) currentIndex++;

      prevButton.setDisabled(currentIndex === 0);
      nextButton.setDisabled(currentIndex === userCards.length - 1);
      row = new ActionRowBuilder().addComponents(prevButton, storageButton, nextButton);

      await interaction.update({ embeds: [createEmbed(currentIndex)], components: [row] });
    });

    collector.on("end", () => {
      prevButton.setDisabled(true);
      nextButton.setDisabled(true);
      row = new ActionRowBuilder().addComponents(prevButton, storageButton, nextButton);
      msg.edit({ components: [row] }).catch(() => {});
    });
  }
};
