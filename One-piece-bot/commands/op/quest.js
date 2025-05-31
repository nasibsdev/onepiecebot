const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const collectionPath = path.join(__dirname, "../../data/userCollection.json");
const missionPath = path.join(__dirname, "../../data/mission.json");
const duelWinsPath = path.join(__dirname, "../../data/duelWins.json");
const currencyPath = path.join(__dirname, "../../data/userCurrency.json");
const inventoryPath = path.join(__dirname, "../../data/userInventory.json");

module.exports = {
  name: "quest",
  async execute(message) {
    const userId = message.author.id;

    // Load all required data
    const userCollection = JSON.parse(fs.readFileSync(collectionPath, "utf8"));
    const missionData = JSON.parse(fs.readFileSync(missionPath, "utf8"));
    const duelWins = JSON.parse(fs.readFileSync(duelWinsPath, "utf8"));
    const userCurrency = JSON.parse(fs.readFileSync(currencyPath, "utf8"));
    const userInventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));

    const currentTime = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // Init quest tracking
    if (!missionData[userId]) {
      missionData[userId] = {
        count: 0,
        correct: 0,
        lastCompleted: 0,
        claimed: false,
        chestCountSnapshot: 0
      };
    }

    const mission = missionData[userId];

    // Reset daily
    if (currentTime - mission.lastCompleted >= oneDay) {
      mission.count = 0;
      mission.correct = 0;
      mission.lastCompleted = currentTime;
      mission.claimed = false;
      mission.chestCountSnapshot = getChestOpenCount(userInventory[userId]);
    }

    // Pull count
    const pulls = userCollection[userId]
      ? Object.values(userCollection[userId]).reduce((sum, card) => sum + (card.pulls || 0), 0)
      : 0;

    // Duel count
    const duelWinCount = duelWins[userId] || 0;

    // Quiz count
    const quizCorrect = mission.correct || 0;

    // Chest count (based on change in inventory)
    const totalChestsOpened = getChestOpenCount(userInventory[userId]) - (mission.chestCountSnapshot || 0);

    // Quest completions
    const quest1Done = pulls >= 5;
    const quest2Done = duelWinCount >= 3;
    const quest3Done = quizCorrect >= 3;
    const quest4Done = totalChestsOpened >= 3;

    // Init currency if needed
    if (!userCurrency[userId]) {
      userCurrency[userId] = { beli: 0, resetTokens: 0 };
    }

    const userData = userCurrency[userId];
    let rewardMessage = "";

    // Rewards per quest
    if (quest1Done && mission.count < 1) {
      userData.beli += 100;
      mission.count++;
      rewardMessage += "✅ Pulled 5 cards — +100 Beli\n";
    }

    if (quest2Done && mission.count < 2) {
      userData.beli += 100;
      mission.count++;
      rewardMessage += "✅ Won 3 duels — +100 Beli\n";
    }

    if (quest3Done && mission.count < 3) {
      userData.beli += 100;
      mission.count++;
      rewardMessage += "✅ Answered 3 quizzes — +100 Beli\n";
    }

    if (quest4Done && mission.count < 4) {
      userData.beli += 100;
      mission.count++;
      rewardMessage += "✅ Opened 3 chests — +100 Beli\n";
    }

    if (mission.count === 4 && !mission.claimed) {
      userData.resetTokens += 1;
      mission.claimed = true;
      rewardMessage += `🎉 All quests completed! You earned **1 Reset Token**!\n`;
    }

    // Save
    fs.writeFileSync(missionPath, JSON.stringify(missionData, null, 2));
    fs.writeFileSync(currencyPath, JSON.stringify(userCurrency, null, 2));

    // Build response
    const embed = new EmbedBuilder()
      .setTitle("📋 Daily Quests")
      .setColor(0x00bfff)
      .setDescription(`<@${userId}>'s progress for today:`)
      .addFields(
        { name: "🎴 Pull 5 cards", value: quest1Done ? "✅ Completed" : `❌ ${pulls}/5` },
        { name: "⚔️ Win 3 duels", value: quest2Done ? "✅ Completed" : `❌ ${duelWinCount}/3` },
        { name: "🧠 Answer 3 quizzes", value: quest3Done ? "✅ Completed" : `❌ ${quizCorrect}/3` },
        { name: "📦 Open 3 chests", value: quest4Done ? "✅ Completed" : `❌ ${totalChestsOpened}/3` }
      )
      .setFooter({ text: rewardMessage || "Keep going — daily rewards are waiting!" });

    message.channel.send({ embeds: [embed] });
  }
};

// 🔍 Helper function to count all chests used
function getChestOpenCount(inventory) {
  if (!inventory) return 0;
  const keys = Object.keys(inventory);
  return keys
    .filter(k => k.toLowerCase().includes("chest"))
    .reduce((acc, key) => acc + inventory[key], 0);
}
