const { EmbedBuilder } = require("discord.js");
const allCards = require("../../data/cards");
const fs = require("fs");
const path = require("path");

const collectionFilePath = path.resolve(__dirname, "../../data/userCollection.json");

function readCollection() {
  if (!fs.existsSync(collectionFilePath)) return {};
  try {
    const data = fs.readFileSync(collectionFilePath, "utf8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function writeCollection(data) {
  fs.writeFileSync(collectionFilePath, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "mod",
  description: "Mod tools (op cheats, op givecard)",
  async execute(message, args) {
    const userId = message.author.id;

    if (!args.length) {
      return message.reply("<:arrow:1375872983029256303> Please specify a subcommand like `op mod cheats` or `op mod givecard`.");
    }

    const subcommand = args[0].toLowerCase();

    if (subcommand === "cheats") {
      const embed = new EmbedBuilder()
        .setTitle("Mod Cheats")
        .setDescription(
          "**op givecard [name] [amount]** → Give yourself a card.\n" +
          "→ Example: `op givecard luf 50`"
        )
        .setColor("Red");
      return message.channel.send({ embeds: [embed] });
    }

    if (subcommand === "givecard") {
      const prefix = args[1]?.toLowerCase();
      const amount = parseInt(args[2]);

      if (!prefix || isNaN(amount) || amount < 1) {
        return message.reply("<:View_As_Role_Arrow:1375578241380651089> Usage: `op givecard [name] [amount]`");
      }

      const foundCard = allCards.find(card =>
        card.name.toLowerCase().startsWith(prefix)
      );

      if (!foundCard) {
        return message.reply("<:View_As_Role_Arrow:1375578241380651089> Card not found. Try using the first few letters of the name.");
      }

      const collection = readCollection();
      if (!collection[userId]) collection[userId] = {};

      const existing = collection[userId][foundCard.name];

      if (!existing) {
        collection[userId][foundCard.name] = {
          rank: foundCard.rank,
          power: foundCard.power,
          health: foundCard.health,
          speed: foundCard.speed,
          image: foundCard.image,
          pulls: amount,
          evolved: false
        };
      } else {
        existing.pulls += amount;
      }

      writeCollection(collection);

      const embed = new EmbedBuilder()
        .setTitle("<:sucess:1375872950321811547> Card Granted")
        .setDescription(`You received **${amount}x** ${foundCard.name}`)
        .setColor("Green")
        .setThumbnail(foundCard.image);
      return message.channel.send({ embeds: [embed] });
    }

    return message.reply("<:View_As_Role_Arrow:1375578241380651089> Unknown subcommand.");
  }
};
