const fs = require("fs");
const path = require("path");

const currencyPath = path.join(__dirname, "../../data/userCurrency.json");
const inventoryPath = path.join(__dirname, "../../data/userInventory.json");
const dailyPath = path.join(__dirname, "../../data/userDaily.json");

function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "{}");
  return JSON.parse(fs.readFileSync(filePath));
}

function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  name: "daily",
  description: "Claim your daily rewards!",

  async execute(message) {
    const userId = message.author.id;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    const dailyData = loadJSON(dailyPath);
    const currencyData = loadJSON(currencyPath);
    const inventoryData = loadJSON(inventoryPath);

    const userDaily = dailyData[userId] || { lastClaim: 0, streak: 0 };
    const timeSinceLast = now - userDaily.lastClaim;

    // Streak reset if over 24h
    if (userDaily.lastClaim && timeSinceLast > oneDay) {
      userDaily.streak = 0;
    }

    // Cooldown
    if (timeSinceLast < oneDay) {
      const timeLeft = oneDay - timeSinceLast;
      const hours = Math.floor(timeLeft / 3600000);
      const minutes = Math.floor((timeLeft % 3600000) / 60000);
      return message.reply(
        `🕒 You already claimed your daily! Come back in **${hours}h ${minutes}m**.`
      );
    }

    userDaily.streak = Math.min(userDaily.streak + 1, 5);
    userDaily.lastClaim = now;

    // Init currency/inventory
    currencyData[userId] = currencyData[userId] || { beli: 0, resetTokens: 0 };
    inventoryData[userId] = inventoryData[userId] || {};

    // Reward logic
    const streak = userDaily.streak;
    const rewards = [];

    function addItem(name, amount = 1) {
      inventoryData[userId][name] = (inventoryData[userId][name] || 0) + amount;
      rewards.push(`+${amount} ${name}`);
    }

    function chance(percent) {
      return Math.random() * 100 < percent;
    }

    function addFrag(type, min, max) {
      const amount = getRandom(min, max);
      addItem(`${type}_frag`, amount);
    }

    let beli = 0;
    switch (streak) {
      case 1:
        beli = getRandom(100, 250);
        if (chance(50)) addItem("C Tier Chest");
        break;
      case 2:
        beli = getRandom(200, 400);
        addItem("C Tier Chest", getRandom(1, 2));
        if (chance(50)) addItem("B Tier Chest");
        if (chance(20)) currencyData[userId].resetTokens += 1;
        addFrag("c", 1, 2);
        break;
      case 3:
        beli = getRandom(250, 500);
        addItem("B Tier Chest", getRandom(1, 2));
        if (chance(50)) addItem("A Tier Chest");
        if (chance(50)) currencyData[userId].resetTokens += 1;
        addFrag("c", 2, 5);
        addFrag("b", 1, 2);
        break;
      case 4:
        beli = getRandom(500, 1000);
        addItem("A Tier Chest", getRandom(1, 2));
        if (chance(50)) addItem("S Tier Chest");
        currencyData[userId].resetTokens += 1;
        addFrag("b", 2, 5);
        addFrag("a", 1, 2);
        if (chance(50)) addFrag("s", 1, 1);
        break;
      case 5:
        beli = getRandom(1000, 2000);
        addItem("C Tier Chest", 5);
        addItem("B Tier Chest", 3);
        addItem("A Tier Chest", getRandom(1, 2));
        addItem("S Tier Chest", getRandom(1, 2));
        if (chance(10)) addItem("UR Tier Chest");
        currencyData[userId].resetTokens += getRandom(1, 5);
        addFrag("c", 10, 10);
        addFrag("b", 5, 5);
        addFrag("a", 3, 3);
        addFrag("s", getRandom(1, 2));
        if (chance(30)) addFrag("ss", 1, 1);
        if (chance(1)) addItem("Summoning SS Fragment");
        if (chance(1)) addItem("Summoning UR Fragment");
        if (chance(0.5)) addItem("Armament Haki Plate");
        if (chance(0.5)) addItem("Observation Haki Plate");
        if (chance(0.5)) addItem("Conqueror's Haki Plate");
        break;
    }

    currencyData[userId].beli += beli;
    rewards.unshift(`💸 +${beli} Beli`);

    // Save all
    dailyData[userId] = userDaily;
    saveJSON(dailyPath, dailyData);
    saveJSON(currencyPath, currencyData);
    saveJSON(inventoryPath, inventoryData);

    message.reply({
      embeds: [
        {
          color: 0xfcd34d,
          title: `📅 Daily Rewards - Day ${streak}`,
          description: rewards.join("\n"),
          footer: {
            text: streak < 5
              ? `Claim tomorrow to reach Day ${streak + 1}!`
              : `You're at the max streak. Keep it up!`,
          },
        },
      ],
    });
  },
};
