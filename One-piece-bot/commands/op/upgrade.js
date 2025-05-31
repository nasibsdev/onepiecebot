const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const allCards = require("../../data/cards");

const collectionPath = path.resolve(__dirname, "../../data/userCollection.json");
const currencyPath = path.resolve(__dirname, "../../data/userCurrency.json");

const basePullRequirements = {
  C: 30,
  B: 30,
  A: 10,
  S: 5,
  SS: 3,
  UR: 0
};

const sellPrices = {
  C: 50,
  B: 100,
  A: 250,
  S: 500,
  SS: 2500,
  UR: 10000
};

function fuzzyMatch(input, collection) {
  const lowered = input.toLowerCase();
  return Object.keys(collection).find(
    key => key.toLowerCase() === lowered || key.toLowerCase().includes(lowered)
  );
}

function traceChain(cardName) {
  const chain = [];
  let card = allCards.find(c => c.name === cardName);
  while (card) {
    chain.unshift(card);
    card = allCards.find(c => c.name === card.evolvesFrom);
  }
  return chain;
}

function sumPulls(userCollection, chain) {
  return chain.reduce((total, card) => {
    const owned = userCollection[card.name];
    return total + (owned?.pulls || 0);
  }, 0);
}

function removeChain(userCollection, chain) {
  for (const card of chain) {
    delete userCollection[card.name];
  }
}

function getFinalStageCost(finalRank) {
  if (finalRank === "UR") return { cost: 25000, requiredPulls: 250 };
  if (finalRank === "SS") return { cost: 10000, requiredPulls: 100 };
  if (finalRank === "S") return { cost: 5000, requiredPulls: 80 };
  return { cost: 37500, requiredPulls: 0 }; // fallback
}

module.exports = {
  name: "upgrade",
  description: "Upgrade a card to the next evolution stage.",
  async execute(message, args) {
    const userId = message.author.id;

    const collection = fs.existsSync(collectionPath)
      ? JSON.parse(fs.readFileSync(collectionPath, "utf8"))
      : {};
    const currency = fs.existsSync(currencyPath)
      ? JSON.parse(fs.readFileSync(currencyPath, "utf8"))
      : {};

    const userCollection = collection[userId] || {};
    const userCurrency = currency[userId] || { beli: 0 };
    const userBeli = userCurrency.beli;

    if (!args.length) {
      return message.channel.send("<:arrow:1375872983029256303> Please specify the card you want to upgrade.");
    }

    const input = args.join(" ");
    const matchedName = fuzzyMatch(input, userCollection);
    if (!matchedName) {
      return message.channel.send("<:arrow:1375872983029256303> Could not find a matching card in your collection.");
    }

    const currentCard = allCards.find(c => c.name === matchedName);
    if (!currentCard) {
      return message.channel.send("<:arrow:1375872983029256303> Card data not found.");
    }

    const nextCard = allCards.find(c => c.evolvesFrom === currentCard.name);
    const m3Card = nextCard ? allCards.find(c => c.evolvesFrom === nextCard.name) : null;

    if (!nextCard) {
      return message.channel.send("<:arrow:1375872983029256303> This card cannot be upgraded further.");
    }

    const chain = traceChain(currentCard.name);
    const baseCard = chain[0];
    const currentStage = chain.length;
    const nextStage = currentStage + 1;

    const totalPulls = sumPulls(userCollection, chain);
    let requiredPulls, upgradeCost;

    if (nextStage === 3) {
      const { cost, requiredPulls: pulls } = getFinalStageCost(nextCard.rank);
      requiredPulls = pulls;
      upgradeCost = cost;
    } else {
      requiredPulls = basePullRequirements[baseCard.rank] * currentStage;
      upgradeCost = (sellPrices[nextCard.rank] || 100) * (10 + 5 * (currentStage - 1));
    }

    if (totalPulls < requiredPulls) {
      return message.channel.send(
        `<:arrow:1375872983029256303> You need **${requiredPulls}** total pulls of **${baseCard.name}** to upgrade.\nYou currently have **${totalPulls}**.`
      );
    }

    if (userBeli < upgradeCost) {
      return message.channel.send(
        `<:arrow:1375872983029256303> You need **${upgradeCost.toLocaleString()}** beli to upgrade.\nYou only have **${userBeli.toLocaleString()}**.`
      );
    }

    // Perform upgrade
    removeChain(userCollection, chain);

    // Create new evolved card entry
    let newPulls;
    if (nextStage === 3) {
      newPulls = 1; // Final form M3, always 1 pull
    } else if (!m3Card) {
      // No M3 exists, M2 is final form - convert total pulls to 1
      newPulls = 1;
    } else {
      // M3 exists, keep all pulls for M2 stage
      newPulls = totalPulls;
    }

    userCollection[nextCard.name] = {
      rank: nextCard.rank,
      pulls: newPulls,
      power: nextCard.power,
      health: nextCard.health,
      speed: nextCard.speed,
      image: nextCard.image,
      evolutionStage: nextStage
    };


    userCurrency.beli -= upgradeCost;
    currency[userId] = userCurrency;
    collection[userId] = userCollection;

    fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
    fs.writeFileSync(currencyPath, JSON.stringify(currency, null, 2));

    const embed = new EmbedBuilder()
      .setColor("#00b8d9")
      .setTitle("<:icon11:1375881888656392294> Card Upgraded!")
      .setThumbnail(nextCard.image)
      .addFields(
        { name: "<:icon10:1375881812555071558> Upgraded From", value: currentCard.name, inline: true },
        { name: "<:icon11:1375881888656392294> To", value: nextCard.name, inline: true },
        { name: "<:icon8:1375881505322307775> Rank", value: nextCard.rank, inline: true },
        { name: "Stats", value: `<:icon6:1375881131475341322> Power: ${nextCard.power}\n<:icon7:1375881261133856930> Health: ${nextCard.health}\n<:icon5:1375880705078460436> Speed: ${nextCard.speed}` },
        { name: "<:icon12:1375882076917858355> Stage", value: `${nextStage}`, inline: true },
        { name: "<:Money:1375579299565928499> Beli Spent", value: `${upgradeCost.toLocaleString()}`, inline: true }
      )
      .setFooter({ text: "Upgrade complete! Keep progressing!" });

    return message.channel.send({ embeds: [embed] });
  }
};
