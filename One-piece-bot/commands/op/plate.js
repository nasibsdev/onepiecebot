const fs = require("fs");
const path = require("path");
const Fuse = require("fuse.js");
const { EmbedBuilder } = require("discord.js");

const collectionPath = path.resolve(__dirname, "../../data/userCollection.json");
const allCards = require("../../data/cards");

module.exports = {
  name: "plate",
  description: "Equip a Haki Plate (armament, conqueror, or observation) to one of your cards.",
  async execute(message, args) {
    if (args.length < 2) {
      return message.reply("<:arrow:1375872983029256303> Usage: `op plate <armament|conqueror|observation> <card name>`");
    }

    const plateType = args[0].toLowerCase();
    const validPlates = ["armament", "conqueror", "observation"];
    if (!validPlates.includes(plateType)) {
      return message.reply("<:arrow:1375872983029256303> Invalid plate type. Choose from: armament, conqueror, observation.");
    }

    const cardNameInput = args.slice(1).join(" ");
    const fuse = new Fuse(allCards, { keys: ["name"], threshold: 0.4 });
    const result = fuse.search(cardNameInput)[0];
    if (!result) {
      return message.reply("<:arrow:1375872983029256303> Card not found.");
    }

    const cardName = result.item.name;

    // Read user collection
    const data = JSON.parse(fs.readFileSync(collectionPath));
    const userCards = data[message.author.id];
    if (!userCards || !userCards[cardName]) {
      return message.reply("<:arrow:1375872983029256303> You don't own this card.");
    }

    const card = userCards[cardName];
    card.plates = card.plates || {};

    // Plate already equipped?
    if (plateType === "armament" && card.plates.armament) {
      return message.reply("<:arrow:1375872983029256303> This card already has an Armament Haki Plate.");
    }
    if (plateType === "conqueror" && card.plates.conqueror) {
      return message.reply("<:arrow:1375872983029256303> This card already has a Conqueror's Haki Plate.");
    }
    if (plateType === "observation" && card.plates.observation) {
      return message.reply("<:arrow:1375872983029256303> This card already has an Observation Haki Plate.");
    }

    // Apply stats boost & set plate
    let embed = new EmbedBuilder()
      .setTitle("Haki Plate Equipped!")
      .setColor("#5865F2") // Discord blurple color
      .setFooter({ text: `Equipped by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    switch (plateType) {
      case "armament":
        card.plates.armament = true;
        card.power = Math.floor(card.power * 1.2);
        embed.setDescription(`<:haki:1375611247676096572> **Armament Haki Plate** equipped to **${cardName}**!\nPower increased by 20%.`);
        break;

      case "conqueror":
        card.plates.conqueror = true;
        card.power = Math.floor(card.power * 1.07);
        card.health = Math.floor(card.health * 1.07);
        card.speed = Math.floor(card.speed * 1.07);
        embed.setDescription(`<:haki:1375611247676096572> **Conqueror's Haki Plate** equipped to **${cardName}**!\nPower, Health & Speed increased by 7%.`);
        break;

      case "observation":
        card.plates.observation = true;
        card.health = Math.floor(card.health * 1.1);
        card.speed = Math.floor(card.speed * 1.1);
        embed.setDescription(`<:haki:1375611247676096572> **Observation Haki Plate** equipped to **${cardName}**!\nHealth & Speed increased by 10%.`);
        break;
    }

    // Save changes
    fs.writeFileSync(collectionPath, JSON.stringify(data, null, 2));
    message.reply({ embeds: [embed] });
  },
};
