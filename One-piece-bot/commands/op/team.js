const { EmbedBuilder } = require("discord.js");
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

function findCardName(userCollection, query) {
  const lowerQuery = query.toLowerCase();
  const matches = Object.keys(userCollection).filter(name =>
    name.toLowerCase().includes(lowerQuery)
  );
  if (matches.length === 1) return matches[0];
  return matches;
}

// Optional: emoji map for ranks
const rankEmoji = {
  C: "<:c_:1375608627213242468>",
  B: "<:b_:1375608257921679360>",
  A: "<:a_:1375608345288904786>",
  S: "<:s_:1375608412477329600>",
  SS: "<:ss:1375608448183701637>",
  UR: "<:ur:1375608483940139048>"
};

module.exports = {
  name: "team",
  description: "Manage your One Piece team",
  async execute(message, args) {
    const userId = message.author.id;
    const collection = readCollection();

    if (!collection[userId]) {
      return message.channel.send("<:arrow:1375872983029256303> You have no cards or team yet. Pull cards first!");
    }

    if (!Array.isArray(collection[userId].team)) {
      collection[userId].team = [];
    }

    const sub = args[0]?.toLowerCase();

    // Show team
    if (!sub) {
      if (collection[userId].team.length === 0) {
        return message.channel.send("<:arrow:1375872983029256303> Your team is empty. Use `op team add <card>` to add cards.");
      }

      const embed = new EmbedBuilder()
        .setTitle(`${message.author.username}'s Pirate Team`)
        .setColor("#f5a623")
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: "Team Limit: 3 cards • Use `op team add` or `op team remove`" });

      for (const cardName of collection[userId].team) {
        const card = collection[userId][cardName];
        if (!card) continue;

        const emoji = rankEmoji[card.rank] || "";
        embed.addFields({
          name: `${emoji} ${cardName}`,
          value: `**Rank:** ${card.rank}  •  **Pulls:** ${card.pulls}/10\n[🔗 View Card](${card.image})`,
          inline: false
        });
      }

      // Highlight the first card as the "leader" with image
      const firstCard = collection[userId][collection[userId].team[0]];
      if (firstCard) {
        embed.setImage(firstCard.image);
      }

      return message.channel.send({ embeds: [embed] });
    }

    // Add to team
    if (sub === "add") {
      const inputName = args.slice(1).join(" ");
      if (!inputName) return message.channel.send("<:arrow:1375872983029256303> Please specify a card name to add.");

      const found = findCardName(collection[userId], inputName);
      if (!found || found.length === 0) return message.channel.send("<:arrow:1375872983029256303> No matching card found.");
      if (Array.isArray(found) && found.length > 1) {
        return message.channel.send(`<:arrow:1375872983029256303> Multiple cards match your input: ${found.join(", ")}`);
      }

      const cardName = Array.isArray(found) ? found[0] : found;

      if (!collection[userId][cardName]) {
        return message.channel.send(`<:arrow:1375872983029256303> You don't own the card **${cardName}**.`);
      }

      if (collection[userId].team.includes(cardName)) {
        return message.channel.send(`<:arrow:1375872983029256303> **${cardName}** is already in your team.`);
      }

      if (collection[userId].team.length >= 3) {
        return message.channel.send("<:View_As_Role_Arrow:1375578241380651089> Your team is full. Remove a card before adding a new one.");
      }

      collection[userId].team.push(cardName);
      writeCollection(collection);
      return message.channel.send(`<:sucess:1375872950321811547> Added **${cardName}** to your team.`);
    }

    // Remove from team
    if (sub === "remove") {
      const inputName = args.slice(1).join(" ");
      if (!inputName) return message.channel.send("<:arrow:1375872983029256303> Please specify a card name to remove.");

      const found = findCardName(collection[userId], inputName);
      if (!found || found.length === 0) return message.channel.send("<:arrow:1375872983029256303> No matching card found.");
      if (Array.isArray(found) && found.length > 1) {
        return message.channel.send(`<:arrow:1375872983029256303> Multiple cards match your input: ${found.join(", ")}`);
      }

      const cardName = Array.isArray(found) ? found[0] : found;

      if (!collection[userId].team.includes(cardName)) {
        return message.channel.send(`<:arrow:1375872983029256303> **${cardName}** is not in your team.`);
      }

      collection[userId].team = collection[userId].team.filter(c => c !== cardName);
      writeCollection(collection);
      return message.channel.send(`<:sucess:1375872950321811547> Removed **${cardName}** from your team.`);
    }

    return message.channel.send("<:arrow:1375872983029256303> Unknown subcommand.");
  }
};
