const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const inventoryFilePath = path.resolve(__dirname, "../../data/userInventory.json");

// Load inventory file
function readInventory() {
  if (!fs.existsSync(inventoryFilePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(inventoryFilePath, "utf8"));
  } catch {
    return {};
  }
}

// Save inventory file
function writeInventory(data) {
  try {
    fs.writeFileSync(inventoryFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error("Failed to write inventory file:", err);
    return false;
  }
}

// Get or initialize a user's inventory
function getInventory(userId) {
  const data = readInventory();
  if (!data[userId]) {
    data[userId] = {
      "C Tier Chest": 0,
      "B Tier Chest": 0,
      "A Tier Chest": 0,
      "S Tier Chest": 0,
      "SS Tier Chest": 0,
      "UR Tier Chest": 0,
      "Z Tier Chest": 0,
      "c_frag": 0,
      "b_frag": 0,
      "a_frag": 0,
      "s_frag": 0,
      "ss_frag": 0,
      "ur_frag": 0,
      "Summoning SS Fragment": 0,
      "Summoning UR Fragment": 0,
      "Summoning God Fragment": 0,
      "Armament Haki Plate": 0,
      "Observation Haki Plate": 0,
      "Conqueror's Haki Plate": 0
    };
    writeInventory(data);
  }
  return data[userId];
}

// Update a user's inventory
function updateInventory(userId, inventory) {
  const data = readInventory();
  data[userId] = inventory;
  writeInventory(data);
}

// Emoji mapping
const emojiMap = {
  "C Tier Chest": "<:Chest:1375599735854989403>",
  "B Tier Chest": "<:Chest:1375599735854989403>",
  "A Tier Chest": "<:Chest:1375599735854989403>",
  "S Tier Chest": "<:Chest:1375599735854989403>",
  "SS Tier Chest": "<:Chest:1375599735854989403>",
  "UR Tier Chest": "<:Chest:1375599735854989403>",
  "Z Tier Chest": "<:Chest:1375599735854989403>",
  "c_frag": "<:c_:1375608627213242468>",
  "b_frag": "<:b_:1375608257921679360>",
  "a_frag": "<:a_:1375608345288904786>",
  "s_frag": "<:s_:1375608412477329600>",
  "ss_frag": "<:ss:1375608448183701637>",
  "ur_frag": "<:ur:1375608502168875008>",
  "Summoning SS Fragment": "<:summon:1375616323257766009>",
  "Summoning UR Fragment": "<:summonur:1375616431890235392>",
  "Summoning God Fragment": "<:summonur:1375616431890235392>",
  "Armament Haki Plate": "<:haki:1375611247676096572>",
  "Observation Haki Plate": "<:haki:1375611247676096572>",
  "Conqueror's Haki Plate": "<:haki:1375611247676096572>"
};

// Display name mapping
const nameMap = {
  "c_frag": "C Universal Fragment",
  "b_frag": "B Universal Fragment",
  "a_frag": "A Universal Fragment",
  "s_frag": "S Universal Fragment",
  "ss_frag": "SS Universal Fragment",
  "ur_frag": "UR Universal Fragment"
};

// Inventory command
async function execute(message) {
  const userId = message.author.id;
  const inventory = getInventory(userId);

  const itemList = Object.entries(inventory)
    .filter(([_, count]) => count > 0)
    .map(([item, count]) => {
      const emoji = emojiMap[item] || "";
      const name = nameMap[item] || item;
      return `${emoji} **${name}** (${count})`;
    })
    .join("\n") || "<:arrow:1375872983029256303> You don't have any items yet.";

  const embed = new EmbedBuilder()
    .setTitle(`<:namirich:1375662701702807632> ${message.author.username}'s Inventory`)
    .setColor("#facc15")
    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
    .setDescription(itemList)
    .setFooter({
      text: "One Piece Bot • Use `op help` for more",
      iconURL: message.client.user.displayAvatarURL()
    })
    .setTimestamp();

  return message.channel.send({ embeds: [embed] });
}

module.exports = {
  name: "inventory",
  aliases: ["inv"],
  description: "Check your current inventory of chests and items.",
  execute,
  getInventory,
  updateInventory
};
