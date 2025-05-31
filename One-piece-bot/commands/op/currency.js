const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "../../data/userCurrency.json");

function readCurrency() {
  if (!fs.existsSync(filePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

function writeCurrency(data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error("Failed to write userCurrency.json:", err);
    return false;
  }
}

function getUserCurrency(userId) {
  const data = readCurrency();
  if (!data[userId]) {
    data[userId] = { beli: 0, resetTokens: 5 };
    writeCurrency(data);
  }
  return data[userId];
}

function updateBeli(userId, amount) {
  const data = readCurrency();
  if (!data[userId]) data[userId] = { beli: 0, resetTokens: 5 };
  data[userId].beli += amount;
  writeCurrency(data);
}

function getBalance(userId) {
  const data = readCurrency();
  return data[userId]?.beli ?? 0;
}

function getResetTokens(userId) {
  const data = readCurrency();
  return data[userId]?.resetTokens ?? 5;
}

function useResetToken(userId) {
  const data = readCurrency();
  if (!data[userId]) data[userId] = { beli: 0, resetTokens: 5 };
  if (data[userId].resetTokens <= 0) return false;
  data[userId].resetTokens -= 1;
  writeCurrency(data);
  return true;
}

function addResetToken(userId, amount) {
  const data = readCurrency();
  if (!data[userId]) data[userId] = { beli: 0, resetTokens: 5 };
  data[userId].resetTokens += amount;
  writeCurrency(data);
}

module.exports = {
  getBalance,
  getResetTokens,
  updateBeli,
  useResetToken,
  addResetToken,
};

