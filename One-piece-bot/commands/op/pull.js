const { EmbedBuilder } = require("discord.js");
const allCards = require("../../data/cards");
const fs = require("fs");
const path = require("path");
const { getResetTokens } = require("./currency");

const collectionFilePath = path.resolve(__dirname, "../../data/userCollection.json");
const currencyFilePath = path.resolve(__dirname, "../../data/userCurrency.json");
const statsFilePath = path.resolve(__dirname, "../../data/userStats.json");

const rarityWeights = [
  { rank: "C", weight: 60 },
  { rank: "B", weight: 30 },
  { rank: "A", weight: 6 },
  { rank: "S", weight: 2 },
  { rank: "SS", weight: 1 },
  { rank: "UR", weight: 0.1 },
];

const rarityColors = {
  C: "#bbbfbd",
  B: "#5dbafc",
  A: "#a05dfc",
  S: "#fca85d",
  SS: "#fc682d",
  UR: "#ff1212",
};

const evolvePullsNeeded = {
  C: 30,
  B: 30,
  A: 10,
  S: 5,
  SS: 3,
  UR: 0,
};

const sellPrices = {
  C: 50,
  B: 100,
  A: 250,
  S: 500,
  SS: 2500,
  UR: 10000,
};

const rankIcons = {
  C: "https://files.catbox.moe/b78lxn.png",
  B: "https://files.catbox.moe/pj7flu.png",
  A: "https://files.catbox.moe/5759yp.png",
  S: "https://files.catbox.moe/b1mc14.png",
  SS: "https://files.catbox.moe/tv0sjw.png",
  UR: "https://files.catbox.moe/36d90u.png",
};

const EIGHT_HOURS = 8 * 60 * 60 * 1000;
const PULL_LIMIT = 10;

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
    console.error("Write failed:", err);
  }
}

function pickRarity() {
  const total = rarityWeights.reduce((sum, r) => sum + r.weight, 0);
  let r = Math.random() * total;
  for (const rw of rarityWeights) {
    if (r < rw.weight) return rw.rank;
    r -= rw.weight;
  }
  return "C";
}

function countCards(userCollection) {
  return Object.values(userCollection).reduce((sum, card) => sum + card.pulls, 0);
}

function findHighestStage(cards, baseName) {
  const chain = allCards.filter(
    (c) =>
      c.name === baseName ||
      c.evolvesFrom === baseName ||
      (c.evolvesFrom &&
        allCards.find((a) => a.name === c.evolvesFrom && a.evolvesFrom === baseName))
  );
  return chain.reverse().find((c) => cards[c.name]) || null;
}

function getHighestAvailableVersion(baseCard, ownedCards) {
  let current = baseCard;
  while (true) {
    const evolved = allCards.find((c) => c.evolvesFrom === current.name);
    if (!evolved || !ownedCards[evolved.name]) break;
    current = evolved;
  }
  return current;
}

module.exports = {
  name: "pull",
  description: "Pull a card",
  async execute(message) {
    const userId = message.author.id;

    const collection = readJSON(collectionFilePath);
    const currency = readJSON(currencyFilePath);
    const stats = readJSON(statsFilePath);

    const now = Date.now();

    if (!stats[userId]) {
      stats[userId] = { pullsInWindow: 0, lastPullReset: now };
    }

    if (now - stats[userId].lastPullReset >= EIGHT_HOURS) {
      stats[userId].pullsInWindow = 0;
      stats[userId].lastPullReset = now;
    }

    if (stats[userId].pullsInWindow >= PULL_LIMIT) {
      let resetTokens = 0;
      try {
        resetTokens = await getResetTokens(userId);
      } catch {
        resetTokens = 0;
      }

      const timeLeft = EIGHT_HOURS - (now - stats[userId].lastPullReset);
      const timeLeftMinutes = Math.floor(timeLeft / (1000 * 60)) || 1;
      const timeLeftHours = Math.floor(timeLeftMinutes / 60);
      const mins = timeLeftMinutes % 60;

      const formatted = timeLeftHours > 0 ? `${timeLeftHours}h ${mins}m` : `${mins}m`;

      const tokenMsg =
        resetTokens > 0
          ? ` You have **<:icon1:1375589270013608206> ${resetTokens}** Reset Tokens. Use \`op resetpulls\`.`
          : "";

      return message.channel.send(
        `<:arrow:1375872983029256303> You've reached your pull limit of ${PULL_LIMIT} cards for this 8-hour window.${tokenMsg} Please wait **${formatted}**
        You have **<:icon1:1375589270013608206> ${resetTokens}** Reset Tokens. Use \`op resetpulls\`.`,
      );
    }

    const pickedRank = pickRarity();
    const baseCards = allCards.filter((card) => card.rank === pickedRank && !card.evolvesFrom);
    if (!baseCards.length)
      return message.channel.send("No cards available for this rarity.");

    let pulledCard = baseCards[Math.floor(Math.random() * baseCards.length)];

    // *** FIX: get full card info for stats injection ***
    const fullCard = allCards.find(card => card.name === pulledCard.name);
    if (!fullCard) {
      return message.channel.send("Card data not found. Try again.");
    }

    if (!collection[userId]) collection[userId] = {};
    if (currency[userId] === undefined) currency[userId] = 0;

    const existingVersion = findHighestStage(collection[userId], pulledCard.name);

    // If user owns an upgraded version already, stack the pull onto that version
    if (existingVersion && existingVersion.name !== pulledCard.name) {
      existingVersion.pulls = (existingVersion.pulls || 1) + 1;
      writeJSON(collectionFilePath, collection);
      stats[userId].pullsInWindow++;
      writeJSON(statsFilePath, stats);

      return message.channel.send(
        `<:arrow:1375872983029256303> You already own an evolved version of **${pulledCard.name}**. The pull was added to your **${existingVersion.name}** instead!`
      );
    }

    const totalCards = countCards(collection[userId]);
    if (totalCards >= 250) {
      const value = sellPrices[pulledCard.rank] || 50;
      currency[userId] += value;
      stats[userId].pullsInWindow++;
      writeJSON(currencyFilePath, currency);
      writeJSON(statsFilePath, stats);
      return message.channel.send(
        `<:arrow:1375872983029256303> Your storage is full. **${pulledCard.name}** was auto-sold for **${value.toLocaleString()}** beli.`,
      );
    }

    // *** FIX: use `userCard` and assign it properly ***
    if (!collection[userId][pulledCard.name]) {
      collection[userId][pulledCard.name] = {
        name: fullCard.name,
        rank: fullCard.rank,
        power: fullCard.power,
        health: fullCard.health,
        speed: fullCard.speed,
        image: fullCard.image,
        evolved: false,
        pulls: 1,
      };
    } else {
      collection[userId][pulledCard.name].pulls++;
    }

    stats[userId].pullsInWindow++;
    writeJSON(collectionFilePath, collection);
    writeJSON(statsFilePath, stats);

    const userCard = collection[userId][pulledCard.name];
    const pullsNeeded = evolvePullsNeeded[userCard.rank] || 0;

    const hasNextEvolution = allCards.some(
      (c) => c.evolvesFrom === pulledCard.name,
    );

    let pullsText = "";
    if (hasNextEvolution && !userCard.evolved && pullsNeeded > 0) {
      pullsText = `Pulls until next upgrade: ${userCard.pulls}/${pullsNeeded}`;
    } else if (userCard.evolved) {
      pullsText = "<:sucess:1375872950321811547> Evolved";
    }

    const embed = new EmbedBuilder()
      .setTitle(`${pulledCard.name}`)
      .setDescription(
        `**Power:** ${userCard.power}\n**Health:** ${userCard.health}\n**Speed:** ${userCard.speed}${pullsText ? `\n${pullsText}` : ""}`,
      )
      .setThumbnail(rankIcons[userCard.rank])
      .setImage(userCard.image)
      .setColor(rarityColors[userCard.rank])
      .setFooter({ text: `Rank: ${userCard.rank}` });

    return message.channel.send({ embeds: [embed] });
  },
};
