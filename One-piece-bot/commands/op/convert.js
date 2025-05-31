const fs = require("fs");
const path = require("path");
const Fuse = require("fuse.js");
const { EmbedBuilder } = require("discord.js");

const cards = require("../../data/cards.js");
const userInventoryPath = path.join(__dirname, "../../data/userInventory.json");
const userCollectionPath = path.join(__dirname, "../../data/userCollection.json");
const userCurrencyPath = path.join(__dirname, "../../data/userCurrency.json");

const MAX_CARDS = 250;
const MAX_FRAGMENTS_PER_CARD = 250;
const BELI_PER_FRAGMENT = 100;

const fragDisplayNames = {
  c_frag: "<:c_:1375608627213242468> C Fragment",
  b_frag: "<:b_:1375608257921679360> B Fragment",
  a_frag: "<:a_:1375608345288904786> A Fragment",
  s_frag: "<:s_:1375608412477329600> S Fragment",
  ss_frag: "<:ss:1375608448183701637> SS Fragment",
  ur_frag: "<:ur:1375608483940139048> UR Fragment",
};

function readJSON(file) {
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "convert",
  description: "Convert universal fragments into character-specific ones.",
  usage: "op convert <amount> <rank> <card name>",
  async execute(message, args) {
    if (args.length < 3) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setColor("#ffcc00")
          .setTitle("<:arrow:1375872983029256303> Invalid Command Usage")
          .setDescription("Correct format:\n`op convert <amount> <rank> <card name>`\nExample: `op convert 5 B Monkey D. Luffy`")]
      });
    }

    const amount = parseInt(args[0], 10);
    if (isNaN(amount) || amount <= 0) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setColor("#ff5555")
          .setTitle("<:arrow:1375872983029256303> Invalid Amount")
          .setDescription("Please enter a **positive number** for the amount.")]
      });
    }

    const inputRank = args[1].toUpperCase();
    const cardNameInput = args.slice(2).join(" ");

    const rankFragMap = {
      C: "c_frag",
      B: "b_frag",
      A: "a_frag",
      S: "s_frag",
      SS: "ss_frag",
      UR: "ur_frag",
    };
    const fragKey = rankFragMap[inputRank];
    if (!fragKey) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setColor("#ff5555")
          .setTitle("<:arrow:1375872983029256303> Invalid Rank")
          .setDescription("Valid ranks: `C`, `B`, `A`, `S`, `SS`, `UR`.")]
      });
    }

    let userInventory = readJSON(userInventoryPath);
    let userCollection = readJSON(userCollectionPath);
    let userCurrency = readJSON(userCurrencyPath);

    const userId = message.author.id;

    if (!userInventory[userId]) userInventory[userId] = {};
    if (!userCollection[userId]) userCollection[userId] = {};
    if (!userCurrency[userId]) userCurrency[userId] = { beli: 0 };

    const userFragCount = userInventory[userId][fragKey] || 0;
    if (userFragCount < amount) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setColor("#ff5555")
          .setTitle("<:arrow:1375872983029256303> Not Enough Fragments")
          .setDescription(`You have **${userFragCount}**, but need **${amount}** ${fragDisplayNames[fragKey]}.`)]
      });
    }

    const fuse = new Fuse(cards, { keys: ["name"], threshold: 0.3 });
    const searchResults = fuse.search(cardNameInput);

    if (!searchResults.length) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setColor("#ff5555")
          .setTitle("<:arrow:1375872983029256303> Card Not Found")
          .setDescription(`No match found for **"${cardNameInput}"**.`)]
      });
    }

    const card = searchResults[0].item;

    if (card.rank.toUpperCase() !== inputRank) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setColor("#ff5555")
          .setTitle("<:arrow:1375872983029256303> Rank Mismatch")
          .setDescription(`**${card.name}** is rank **${card.rank}**, not **${inputRank}**.`)]
      });
    }

    let baseCard = card;
    while (baseCard.evolvesFrom) {
      const prev = cards.find((c) => c.name === baseCard.evolvesFrom);
      if (!prev) break;
      baseCard = prev;
    }

    const userCards = userCollection[userId];
    const ownsBaseCard = Object.keys(userCards).some((ownedName) => {
      if (ownedName === baseCard.name) return true;
      let current = cards.find((c) => c.name === ownedName);
      while (current?.evolvesFrom) {
        if (current.evolvesFrom === baseCard.name) return true;
        current = cards.find((c) => c.name === current.evolvesFrom);
      }
      return false;
    });

    if (!ownsBaseCard) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setColor("#ff5555")
          .setTitle("<:arrow:1375872983029256303> Ownership Required")
          .setDescription(`You must own **"${baseCard.name}"** or one of its evolutions to convert fragments.`)]
      });
    }

    const ownsExactCard = userCards[card.name] !== undefined;
    const totalOwnedCards = Object.keys(userCards).length;
    const currentFragments = userCards[card.name]?.fragments || 0;
    const canAddFragments = Math.max(0, MAX_FRAGMENTS_PER_CARD - currentFragments);

    let addableFragments = amount;
    let leftoverFragments = 0;

    if (!ownsExactCard) {
      if (totalOwnedCards >= MAX_CARDS) {
        addableFragments = 0;
        leftoverFragments = amount;
      } else if (amount > canAddFragments) {
        addableFragments = canAddFragments;
        leftoverFragments = amount - canAddFragments;
      }
    } else {
      if (amount > canAddFragments) {
        addableFragments = canAddFragments;
        leftoverFragments = amount - canAddFragments;
      }
    }

    if (addableFragments === 0) {
      const earnedBeli = amount * BELI_PER_FRAGMENT;
      userInventory[userId][fragKey] -= amount;
      userCurrency[userId].beli += earnedBeli;

      writeJSON(userInventoryPath, userInventory);
      writeJSON(userCollectionPath, userCollection);
      writeJSON(userCurrencyPath, userCurrency);

      return message.reply({
        embeds: [new EmbedBuilder()
          .setColor("#ffaa00")
          .setTitle("<:Money:1375579299565928499> Auto-Sold Fragments")
          .setDescription(`Max fragments reached. **${amount}** ${fragDisplayNames[fragKey]} sold for **${earnedBeli}** 🪙 Beli.`)]
      });
    }

    if (!userCards[card.name]) {
      userCards[card.name] = {
        rank: card.rank,
        pulls: addableFragments,  // add all converted pulls at once
        power: card.power,
        health: card.health,
        speed: card.speed,
        image: card.image,
        evolved: card.evolvesFrom ? true : false,
        fragments: 0,
      };
    } else {
      userCards[card.name].pulls += addableFragments;  // add all pulls converted
    }


    userCards[card.name].fragments += addableFragments;
    userInventory[userId][fragKey] -= amount;

    let embed = new EmbedBuilder()
      .setColor("#00cc99")
      .setTitle("<:sucess:1375872950321811547> Conversion Successful")
      .setThumbnail(card.image)
      .setDescription(`**${addableFragments}** ${fragDisplayNames[fragKey]} converted into **${card.name}** fragments.`);

    if (leftoverFragments > 0) {
      const earnedBeli = leftoverFragments * BELI_PER_FRAGMENT;
      userCurrency[userId].beli += earnedBeli;

      embed.addFields({
        name: "🪙 Auto-Sold Leftovers",
        value: `**${leftoverFragments}** fragment(s) auto-sold for **${earnedBeli}** Beli.`,
        inline: false,
      });
    }

    writeJSON(userInventoryPath, userInventory);
    writeJSON(userCollectionPath, userCollection);
    writeJSON(userCurrencyPath, userCurrency);

    return message.reply({ embeds: [embed] });
  },
};
