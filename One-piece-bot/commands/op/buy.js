const fs = require("fs");
const path = require("path");
const Fuse = require("fuse.js");
const { getBalance, updateBeli, addResetToken } = require("../op/currency");
const { EmbedBuilder } = require("discord.js");

const inventoryPath = path.join(__dirname, "../../data/userInventory.json");

const shopItems = [
  { name: "Reset Token", key: "Reset Token", price: 5000, type: "currency" },
  { name: "C Tier Chest", key: "C Tier Chest", price: 500, type: "inventory" },
  { name: "B Tier Chest", key: "B Tier Chest", price: 2500, type: "inventory" },
  { name: "A Tier Chest", key: "A Tier Chest", price: 5000, type: "inventory" },
  { name: "S Tier Chest", key: "S Tier Chest", price: 20000, type: "inventory" },
  { name: "SS Tier Chest", key: "SS Tier Chest", price: 50000, type: "inventory" },
  { name: "UR Tier Chest", key: "UR Tier Chest", price: 100000, type: "inventory" },
  { name: "Z Tier Chest", key: "Z Tier Chest", price: 500000, type: "inventory" },
  { name: "Summoning SS Fragment", key: "Summoning SS Fragment", price: 1000000, type: "inventory" },
  { name: "Summoning UR Fragment", key: "Summoning UR Fragment", price: 1000000, type: "inventory" },
  { name: "Armament Haki Plate", key: "Armament Haki Plate", price: 500000, type: "inventory" },
  { name: "Observation Haki Plate", key: "Observation Haki Plate", price: 500000, type: "inventory" },
  { name: "Conqueror's Haki Plate", key: "Conqueror's Haki Plate", price: 500000, type: "inventory" },
  { name: "c_frag", key: "c_frag", price: 500, type: "inventory" },
  { name: "b_frag", key: "b_frag", price: 1500, type: "inventory" },
  { name: "a_frag", key: "a_frag", price: 3000, type: "inventory" },
  { name: "s_frag", key: "s_frag", price: 10000, type: "inventory" },
  { name: "ss_frag", key: "ss_frag", price: 25000, type: "inventory" },
  { name: "ur_frag", key: "ur_frag", price: 50000, type: "inventory" }
];

function readInventory() {
  if (!fs.existsSync(inventoryPath)) return {};
  return JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
}

function writeInventory(data) {
  fs.writeFileSync(inventoryPath, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "buy",
  description: "Buy an item from the shop",

  async execute(message, args) {
    if (args.length === 0) {
      return message.reply("❌ You need to specify an item to buy! Usage: `op buy <item name> <quantity>`");
    }

    // Extract quantity from args if last one is a number
    let quantity = 1;
    const lastArg = args[args.length - 1];
    if (!isNaN(lastArg) && Number.isInteger(Number(lastArg)) && Number(lastArg) > 0) {
      quantity = Number(lastArg);
      args.pop();
    }

    const itemNameInput = args.join(" ");
    const fuse = new Fuse(shopItems, {
      keys: ["name", "key"],
      threshold: 0.3,
      ignoreLocation: true,
    });

    const results = fuse.search(itemNameInput);
    if (results.length === 0) {
      return message.reply(`❌ Could not find an item named "${itemNameInput}" in the shop.`);
    }

    const item = results[0].item;
    const userId = message.author.id;
    const balance = getBalance(userId);
    const totalCost = item.price * quantity;

    if (balance < totalCost) {
      return message.reply(
        `❌ Not enough Beli. You need **${totalCost.toLocaleString()}**, but you only have **${balance.toLocaleString()}**.`
      );
    }

    // Deduct Beli
    updateBeli(userId, -totalCost);

    if (item.type === "currency") {
      addResetToken(userId, quantity);
    } else if (item.type === "inventory") {
      const inventory = readInventory();
      if (!inventory[userId]) inventory[userId] = {};

      if (!inventory[userId][item.key]) {
        inventory[userId][item.key] = 0;
      }

      inventory[userId][item.key] += quantity;
      writeInventory(inventory);
    }

    const embed = new EmbedBuilder()
      .setColor(0x00ff88)
      .setTitle("✅ Purchase Successful!")
      .setDescription(`You bought **${quantity}x ${item.name}** for **${totalCost.toLocaleString()} Beli**.`)
      .addFields(
        {
          name: "Remaining Beli",
          value: `${getBalance(userId).toLocaleString()} Beli`,
          inline: true,
        },
        {
          name: "Storage",
          value: item.type === "currency" ? "Wallet (Reset Token)" : "Inventory",
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({
        text: "One Piece Bot • op help",
        iconURL: message.client.user.displayAvatarURL(),
      });

    return message.reply({ embeds: [embed] });
  },
};
