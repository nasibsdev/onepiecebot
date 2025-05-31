const fs = require("fs");
const path = require("path");
const { useResetToken } = require("./currency"); // Adjust if needed

const statsFilePath = path.resolve(__dirname, "../../data/userStats.json");

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to write file:", err);
  }
}

module.exports = {
  name: "resetpulls",
  description: "Use a Reset Token to reset your pull limit for the current 8-hour window.",
  async execute(message) {
    const userId = message.author.id;

    const success = await useResetToken(userId);
    if (!success) {
      return message.channel.send("<:arrow:1375872983029256303> You don't have any Reset Tokens left.");
    }

    // Reset the user's pulls in window
    const statsData = readJSON(statsFilePath);
    if (!statsData[userId]) {
      statsData[userId] = { pullsInWindow: 0, lastPullReset: Date.now() };
    } else {
      statsData[userId].pullsInWindow = 0;
      statsData[userId].lastPullReset = Date.now();
    }

    writeJSON(statsFilePath, statsData);

    return message.channel.send(`<:sucess:1375872950321811547> You used 1 Reset Token. Your pull limit has been reset!`);
  },
};
