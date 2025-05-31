const fs = require("fs");
const path = require("path");
const { updateBeli } = require("../op/currency");

const collectionPath = path.resolve(__dirname, "../../data/userCollection.json");

const raritySellPrices = {
  C: 50, B: 100, A: 250, S: 500, SS: 2500, UR: 10000, Z: 25000,
};

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch {
    return false;
  }
}

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, "");
}

function fuzzyMatchCardName(inputName, userCollection) {
  const inputNorm = normalize(inputName);
  const keys = Object.keys(userCollection);

  // 1. Exact match
  let exact = keys.find(key => normalize(key) === inputNorm);
  if (exact) return exact;

  // 2. Contains input
  let partial = keys.find(key => normalize(key).includes(inputNorm));
  if (partial) return partial;

  // 3. Input contains card name
  let reverse = keys.find(key => inputNorm.includes(normalize(key)));
  if (reverse) return reverse;

  return null;
}

module.exports = {
  name: "sell",
  description: "Sell a card from your collection for Beli.",
  async execute(message, args) {
    if (args.length < 2)
      return message.channel.send("<:arrow:1375872983029256303> Usage: `op sell <card name> <quantity>`");

    const userId = message.author.id;
    const quantity = parseInt(args.pop());
    const cardInput = args.join(" ");

    if (isNaN(quantity) || quantity < 1)
      return message.channel.send("<:arrow:1375872983029256303> Please specify a valid quantity greater than 0.");

    const collection = readJson(collectionPath);
    const userCards = collection[userId];

    if (!userCards)
      return message.channel.send("<:arrow:1375872983029256303>  You have no cards in your collection.");

    const cardKey = fuzzyMatchCardName(cardInput, userCards);
    if (!cardKey)
      return message.channel.send(`<:arrow:1375872983029256303>  No card matching **"${cardInput}"** was found in your collection.`);

    const card = userCards[cardKey];
    const currentAmount = card.pulls ?? 0;

    if (currentAmount < quantity)
      return message.channel.send(`<:arrow:1375872983029256303>  You only have** ${currentAmount} **of **"${cardKey}"**. Cannot sell** ${quantity}**.`);

    const sellPrice = raritySellPrices[card.rank] ?? 0;
    if (sellPrice === 0)
      return message.channel.send("<:arrow:1375872983029256303>  This card cannot be sold.");

    // Update card quantity (pulls)
    card.pulls -= quantity;
    if (card.pulls <= 0) {
      delete userCards[cardKey];
      if (Object.keys(userCards).length === 0) delete collection[userId];
    }

    // Save updated collection
    if (!writeJson(collectionPath, collection))
      return message.channel.send("<:arrow:1375872983029256303> Failed to update your collection.");

    // Add beli
    const totalBeli = sellPrice * quantity;
    updateBeli(userId, totalBeli);

    return message.channel.send(
      `<:sucess:1375872950321811547> Sold **${quantity}x ${cardKey}** for **${totalBeli.toLocaleString()} Beli**.`
    );
  },
}