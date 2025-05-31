const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const allCards = require("../../data/cards");

const collectionFilePath = path.resolve(
  __dirname,
  "../../data/userCollection.json"
);
const upgradeRequirements = { C: 30, B: 30, A: 10, S: 5, SS: 3, UR: 0 };
const sellPrices = { C: 50, B: 100, A: 250, S: 500, SS: 2500, UR: 10000 };

function fuzzyMatch(input) {
  const lowered = input.toLowerCase();
  return allCards.find(
    (c) =>
      c.name.toLowerCase() === lowered ||
      c.name.toLowerCase().includes(lowered)
  );
}

function getEvolutionChain(baseName) {
  const chain = [];
  let current = allCards.find((c) => c.name === baseName);
  while (current) {
    chain.push(current);
    current = allCards.find((c) => c.evolvesFrom === current.name);
  }
  return chain;
}

function calculateUpgradeRequirements(card) {
  const base = getEvolutionChain(card.name)[0];
  const stage = getEvolutionChain(base.name).findIndex((c) => c.name === card.name);
  const next = getEvolutionChain(base.name)[stage + 1];
  if (!next) return null;

  const requiredPulls = Math.ceil(
    (upgradeRequirements[base.rank] || 10) * (1 + 1.5 * stage)
  );
  const cost = (sellPrices[next.rank] || 100) * (10 + 5 * stage);
  return { pulls: requiredPulls, beli: cost };
}

module.exports = {
  name: "card",
  description: "Inspect a card and all its evolutions.",
  async execute(message, args) {
    if (!args.length)
      return message.channel.send(
        "<:View_As_Role_Arrow:1375578241380651089> Please specify a card name."
      );

    const input = args.join(" ");
    const match = fuzzyMatch(input);
    if (!match)
      return message.channel.send(
        "<:arrow:1375872983029256303> Card not found."
      );

    const chain = getEvolutionChain(match.name);
    let index = 0;

    const userData = JSON.parse(fs.readFileSync(collectionFilePath));
    const userCards = userData[message.author.id] || {};

    const updateEmbed = (i) => {
      const card = chain[i];
      const upgrade = calculateUpgradeRequirements(card);

      // Check ownership
      const owned = userCards[card.name] ? true : false;

      // Calculate displayed stats with plates boosts
      let displayedPower = card.power;
      let displayedHealth = card.health;
      let displayedSpeed = card.speed;

      if (owned && userCards[card.name].plates) {
        const plates = userCards[card.name].plates;
        if (plates.armament) displayedPower = Math.round(card.power * 1.2);
        if (plates.observation) {
          displayedHealth = Math.round(card.health * 1.1);
          displayedSpeed = Math.round(card.speed * 1.1);
        }
        if (plates.conqueror) {
          displayedPower = Math.round(displayedPower * 1.07);
          displayedHealth = Math.round(displayedHealth * 1.07);
          displayedSpeed = Math.round(displayedSpeed * 1.07);
        }
      }

      // Compose Haki Plates string
      let hakiDesc = "";
      if (owned && userCards[card.name].plates) {
        const plates = userCards[card.name].plates;
        const equipped = [];
        if (plates.armament) equipped.push("<:haki:1375611247676096572> Armament Haki");
        if (plates.observation) equipped.push("<:haki:1375611247676096572> Observation Haki");
        if (plates.conqueror) equipped.push("<:haki:1375611247676096572> Conqueror's Haki");
        if (equipped.length) hakiDesc = `\n**Haki Plates:** ${equipped.join(", ")}`;
      }

      let desc = `**Rank:** ${card.rank}
**Power:** ${displayedPower}
**Health:** ${displayedHealth}
**Speed:** ${displayedSpeed}
**Source:** Card Pulls${hakiDesc}\n\n`;

      if (!owned) {
        desc += "**❌ NOT OWNED ❌**";
      }

      const embed = new EmbedBuilder()
        .setTitle(` ${card.name}`)
        .setDescription(desc)
        .setImage(card.image)
        .setColor(owned ? "#00cc99" : "#cc0000")
        .setFooter({ text: `Stage ${i + 1} of ${chain.length}` });

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("prev")
          .setEmoji("⬅️")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(i === 0),

        new ButtonBuilder()
          .setCustomId("upgrade")
          .setLabel("Upgrade Info")
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId("next")
          .setEmoji("➡️")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(i === chain.length - 1)
      );

      return { embed, components: [buttons] };
    };

    let { embed, components } = updateEmbed(index);
    const msg = await message.channel.send({ embeds: [embed], components });

    const collector = msg.createMessageComponentCollector({ time: 60000 });

    collector.on("collect", async (interaction) => {
      if (interaction.user.id !== message.author.id)
        return interaction.reply({
          content:
            "<:arrow:1375872983029256303> Only the command user can interact with this.",
          ephemeral: true,
        });

      if (interaction.customId === "next") index++;
      else if (interaction.customId === "prev") index--;
      else if (interaction.customId === "upgrade") {
        const upgrade = calculateUpgradeRequirements(chain[index]);
        if (!upgrade)
          return interaction.reply({
            content:
              "<:arrow:1375872983029256303> This card cannot be upgraded further.",
            ephemeral: true,
          });
        return interaction.reply({
          content: `<:Nami_SmileStare:1375577263310897193> To upgrade **${chain[index].name}**, you need:\n- **${upgrade.pulls} pulls**\n- **${upgrade.beli.toLocaleString()} beli**`,
          ephemeral: true,
        });
      }

      const updated = updateEmbed(index);
      await interaction.update({
        embeds: [updated.embed],
        components: updated.components,
      });
    });
  },
};
