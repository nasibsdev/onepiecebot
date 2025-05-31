const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");
const Fuse = require("fuse.js");

// Load card data
const cards = require("../../data/cards.js");
const cardList = Array.isArray(cards) ? cards : Object.values(cards);

const inventoryPath = path.resolve(__dirname, "../../data/userInventory.json");
const collectionPath = path.resolve(__dirname, "../../data/userCollection.json");
const currencyPath = path.resolve(__dirname, "../../data/userCurrency.json"); // Assuming you track beli here

// Utilities
function readJSON(file) {
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function countCards(userCollection) {
  return Object.values(userCollection).reduce((acc, card) => acc + (card.pulls || 0), 0);
}

function findBaseCard(name) {
  const fuse = new Fuse(cardList.filter(card => !card.evolvesFrom), {
    keys: ["name"],
    threshold: 0.3
  });
  return fuse.search(name)[0]?.item || null;
}

const MAX_STORAGE = 250;

module.exports = {
  name: "summon",
  description: "Use Summoning Fragments to summon rare cards.",
  async execute(message, args) {
    const userId = message.author.id;
    const content = message.content.toLowerCase();
    const isGodSummon = content.startsWith("op gsummon");

    if (args.length < 1) return message.channel.send("Please specify a card to summon.");

    // Parse card name and optional quantity (e.g. "Luffy 3")
    let quantity = 1;
    if (!isNaN(args[args.length - 1])) {
      quantity = Math.max(1, Math.floor(Number(args[args.length - 1])));
      args.pop();
    }
    const inputName = args.join(" ");
    if (!inputName) return message.channel.send("Please specify a valid card name.");

    // Find card
    const card = findBaseCard(inputName);
    if (!card) return message.channel.send("Card not found.");
    if (!isGodSummon && !["SS", "UR"].includes(card.rank)) {
      return message.channel.send("You can only summon **SS** or **UR** base cards using fragments.");
    }

    // Read inventory, collection, and currency
    const inventory = readJSON(inventoryPath);
    const collection = readJSON(collectionPath);
    const currency = readJSON(currencyPath);

    if (!inventory[userId]) inventory[userId] = {};
    if (!collection[userId]) collection[userId] = {};
    if (!currency[userId]) currency[userId] = 0;

    // Determine fragment type and check inventory
    const fragKey = isGodSummon
      ? "Summoning God Fragment"
      : `Summoning ${card.rank} Fragment`;

    const availableFrags = inventory[userId][fragKey] || 0;
    if (availableFrags < quantity) {
      return message.channel.send(`You only have **${availableFrags}x ${fragKey}**, but tried to summon ${quantity} cards.`);
    }

    // Check storage capacity
    const currentCount = countCards(collection[userId]);
    const freeSlots = MAX_STORAGE - currentCount;

    if (freeSlots <= 0) {
      return message.channel.send("Your card storage is full! Sell some cards before summoning.");
    }

    const quantityToAdd = Math.min(quantity, freeSlots);
    const quantityToAutoSell = quantity - quantityToAdd;

    // Deduct fragments
    inventory[userId][fragKey] -= quantity;

    // Add cards to collection
    if (!collection[userId][card.name]) {
      collection[userId][card.name] = {
        rank: card.rank,
        pulls: quantityToAdd,
        power: card.power,
        health: card.health,
        speed: card.speed,
        image: card.image,
        evolved: false
      };
    } else {
      collection[userId][card.name].pulls += quantityToAdd;
    }

    // Auto-sell excess cards if any
    let autoSellBeli = 0;
    if (quantityToAutoSell > 0) {
      // Price per rank - adjust as needed
      const sellPrices = { C: 50, B: 100, A: 200, S: 400, SS: 1000, UR: 2000 };
      const sellValue = sellPrices[card.rank] || 50;
      autoSellBeli = sellValue * quantityToAutoSell;
      currency[userId] += autoSellBeli;
    }

    // Save all data
    writeJSON(inventoryPath, inventory);
    writeJSON(collectionPath, collection);
    writeJSON(currencyPath, currency);

    // Compose embed description
    let description = `${message.author.username} summoned **${quantityToAdd}x ${card.name}** using ${quantity} ${fragKey}${quantity > 1 ? "s" : ""}.\n`;
    if (quantityToAutoSell > 0) {
      description += `Storage limit reached! Auto-sold **${quantityToAutoSell}x ${card.name}** for **${autoSellBeli.toLocaleString()}** beli.`;
    }

    const embed = new EmbedBuilder()
      .setTitle("✨ Summon Result")
      .setDescription(description)
      .setImage(card.image || "")
      .setColor(card.rank === "UR" ? 0xffc800 : card.rank === "SS" ? 0xaf00ff : 0x00bfff)
      .setFooter({ text: `Rank: ${card.rank} • Cards added to your collection.` });

    return message.channel.send({ embeds: [embed] });
  }
};
