const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getBalance, updateBeli, getResetTokens } = require("../op/currency");
const { getInventory, updateInventory } = require("../op/inventory");
const fs = require("fs");
const path = require("path");

const emojis = {
  beli: "<:Money:1375579299565928499>",
  chest: "<:Chest:1375599735854989403>",
  reset: "<:icon1:1375589270013608206>",
  c_frag: "<:cremovebgpreview:1375608627213242468>",
  b_frag: "<:c__1_removebgpreview:1375608257921679360>",
  a_frag: "<:c__2_removebgpreview:1375608345288904786>",
  s_frag: "<:c__2_removebgpreview:1375608345288904786>",
  ss_frag: "<:c__2_removebgpreview:1375608345288904786>",
  ur_frag: "<:summonur:1375616431890235392>",
  ss_summon: "<:summon:1375616323257766009>",
  god_summon: "<:summon:1375616431890235392>",
  haki: "<:haki:1375611247676096572>"
};

const raritySettings = {
  C: () => ({ beli: [1, 100] }),
  B: () => ({ beli: [50, 250], resetChance: 0.2, c_frag: 0.5, b_frag: 0.1 }),
  A: () => ({ beli: [100, 500], resetChance: 0.5, c_frag: 0.8, b_frag: 0.5, a_frag: 0.1 }),
  S: () => ({ beli: [250, 500], resetChance: [1, 2], b_frag: 0.8, a_frag: 0.5, s_frag: 0.1, haki: 0.15 }),
  SS: () => ({ beli: [500, 2000], resetAmount: [1, 5], c_frag: [5, 10], b_frag: [3, 5], a_frag: [1, 2], s_frag: 0.8, ss_frag: 1, haki: 0.3 }),
  UR: () => ({ beli: [1000, 5000], resetAmount: [3, 10], c_frag: [5, 25], b_frag: [3, 15], a_frag: [3, 10], s_frag: [2, 5], ss_frag: 1, ss_summon: 0.1, ur_frag: 0.01, god_summon: 0.001, haki: 0.75 }),
  Z: () => ({ beli: [5000, 25000], resetAmount: [5, 10], c_frag: [10, 50], b_frag: [5, 25], a_frag: [5, 20], s_frag: [3, 10], ss_frag: [2, 5], ss_summon: 0.25, ur_frag: 0.05, god_summon: 0.01, haki: 1.5 })
};

const chestKeyMap = {
  C: "C Tier Chest",
  B: "B Tier Chest",
  A: "A Tier Chest",
  S: "S Tier Chest",
  SS: "SS Tier Chest",
  UR: "UR Tier Chest",
  Z: "Z Tier Chest"
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollDrop(rate) {
  return Math.random() < rate;
}

// Add reset tokens directly into userCurrency.json
function addResetToken(userId, amount) {
  const filePath = path.resolve(__dirname, "../../data/userCurrency.json");
  let currencyData = {};
  if (fs.existsSync(filePath)) {
    try {
      currencyData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
      console.error("Failed to read userCurrency.json");
    }
  }

  if (!currencyData[userId]) {
    currencyData[userId] = { beli: 0, resetTokens: 5 };
  }

  currencyData[userId].resetTokens = (currencyData[userId].resetTokens || 0) + amount;
  fs.writeFileSync(filePath, JSON.stringify(currencyData, null, 2));
}

module.exports = {
  name: "chest",
  description: "Open chests to earn rewards!",
  async execute(message, args) {
    const userId = message.author.id;
    const inventory = getInventory(userId);

    const rarity = (args[0] || "C").toUpperCase();
    const amount = Math.max(1, parseInt(args[1]) || 1);
    const chestKey = chestKeyMap[rarity];
    const config = raritySettings[rarity];

    if (!config || !chestKey || !inventory[chestKey] || inventory[chestKey] < amount) {
      return message.reply("<:arrow:1375872983029256303> You don’t have enough chests or the rarity is invalid.");
    }

    inventory[chestKey] -= amount;

    let totalBeli = 0;
    let totalTokens = 0;
    let rewards = [];

    for (let i = 0; i < amount; i++) {
      const drop = config();
      totalBeli += randomInt(...drop.beli);

      // Reset Tokens
      if (drop.resetChance && rollDrop(drop.resetChance)) {
        totalTokens++;
      } else if (drop.resetAmount) {
        totalTokens += randomInt(...drop.resetAmount);
      }

      // Item drops
      for (const key of ["c_frag", "b_frag", "a_frag", "s_frag", "ss_frag", "ss_summon", "ur_frag", "god_summon"]) {
        if (!drop[key]) continue;

        if (Array.isArray(drop[key])) {
          const count = randomInt(...drop[key]);
          if (count > 0) {
            rewards.push(`${count} ${emojis[key]}`);
            inventory[key] = (inventory[key] || 0) + count;
          }
        } else if (rollDrop(drop[key])) {
          rewards.push(`1 ${emojis[key]}`);
          inventory[key] = (inventory[key] || 0) + 1;
        }
      }

      // Haki drop
      if (drop.haki && rollDrop(drop.haki)) {
        rewards.push(`1 ${emojis.haki}`);
        inventory.haki = (inventory.haki || 0) + 1;
      }
    }

    updateBeli(userId, totalBeli);
    addResetToken(userId, totalTokens);
    updateInventory(userId, inventory);

    const embed = new EmbedBuilder()
      .setTitle(`<:namirich:1375662701702807632> You opened ${amount} ${rarity}-Tier Chest(s)!`)
      .setThumbnail(message.author.displayAvatarURL())
      .setColor("Gold")
      .addFields(
        { name: "Beli Earned", value: `${emojis.beli} ${totalBeli}`, inline: true },
        { name: "Reset Tokens", value: `${emojis.reset} ${totalTokens}`, inline: true },
        { name: "Other Rewards", value: rewards.length ? rewards.join("\n") : "None", inline: false }
      )
      .setFooter({ text: "One Piece Card Bot" })
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  }
};
