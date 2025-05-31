const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const pages = {
  main: {
    title: "<:Nami_Smile:1375577191848480819> One Piece Bot Help Menu",
    description:
      "Welcome to the One Piece Bot! Use the buttons below to explore command categories.",
    color: "#0099ff",
  },
  collection: {
    title: "📚 Collection Commands",
    description: [
      "`op pull` – Pull a random One Piece card",
      "`op collection [rank]` – View your card collection (filter by rank)",
      "`op card <cardname>` – Show detailed info of a specific card",
    ].join("\n"),
    color: "#e67e22",
  },
  economy: {
    title: "💰 Economy Commands",
    description: [
      "`op balance` – Check your beli balance",
      "`op mission` – Complete a mission for rewards",
      "`op sell <cardname> [amount]` – Sell cards (partial match supported)",
      "`op daily` – Claim your daily reward",
      "`op shop` – Browse the item shop",
      "`op buy <itemname>` – Buy an item from the shop",
      "`op quest` – View and complete daily quests",
    ].join("\n"),
    color: "#f1c40f",
  },
  utility: {
    title: "🛠️ Utility Commands",
    description: [
      "`op resetpulls` – resets your pulls",
      "`op inventory` – Check your items & fragments",
      "`op upgrade <cardname>` – Upgrade/evolve a card (with pulls & beli)",
    ].join("\n"),
    color: "#95a5a6",
  },
  team: {
    title: "👥 Team Commands",
    description: [
      "`op team` – View your current team",
      "`op team add <cardname>` – Add a card to your team",
      "`op team remove <cardname>` – Remove a card from your team",
    ].join("\n"),
    color: "#3498db",
  },
  items: {
    title: "🎁 Item Commands",
    description: [
      "`op chest <rarity> [amount]` – Open chests to get cards or rewards",
      "`op convert <amount> <rank> <cardname>` – Convert universal fragments",
      "`op plate <plate> <cardname>` – Apply haki plates for stat boosts",
    ].join("\n"),
    color: "#9b59b6",
  },
};

function createEmbed(pageKey, user) {
  const page = pages[pageKey];
  const embed = new EmbedBuilder()
    .setTitle(page.title)
    .setDescription(page.description)
    .setColor(page.color)
    .setFooter({ text: "One Piece Bot" })
    .setTimestamp();

  if (user) {
    embed.setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL(),
    });
  }

  return embed;
}

function createButtons(currentPage) {
  const buttons = [];

  const pageOrder = [
    "main",
    "collection",
    "economy",
    "utility",
    "team",
    "items",
  ];

  const labelMap = {
    main: "Main",
    collection: "Collection",
    economy: "Economy",
    utility: "Utility",
    team: "Team",
    items: "Items",
  };

  for (let i = 0; i < 5; i++) {
    const page = pageOrder[i];
    buttons.push(
      new ButtonBuilder()
        .setCustomId(`help_${page}`)
        .setLabel(labelMap[page])
        .setStyle(
          currentPage === page ? ButtonStyle.Primary : ButtonStyle.Secondary
        )
    );
  }

  // Add 6th button as a separate row if needed
  const extraRow =
    pageOrder.length > 5
      ? new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`help_${pageOrder[5]}`)
            .setLabel(labelMap[pageOrder[5]])
            .setStyle(
              currentPage === pageOrder[5]
                ? ButtonStyle.Primary
                : ButtonStyle.Secondary
            )
        )
      : null;

  const firstRow = new ActionRowBuilder().addComponents(buttons);

  return extraRow ? [firstRow, extraRow] : [firstRow];
}

module.exports = {
  name: "help",
  description: "Shows a list of available One Piece bot commands",
  async execute(message) {
    const embed = createEmbed("main", message.author);
    const buttons = createButtons("main");

    const helpMessage = await message.channel.send({
      embeds: [embed],
      components: buttons,
    });

    const filter = (interaction) =>
      interaction.isButton() && interaction.user.id === message.author.id;

    const collector = helpMessage.createMessageComponentCollector({
      filter,
      time: 120_000, // 2 minutes
    });

    collector.on("collect", (interaction) => {
      const page = interaction.customId.replace("help_", "");

      if (!pages[page]) {
        return interaction.reply({
          content: "Unknown help category.",
          ephemeral: true,
        });
      }

      const newEmbed = createEmbed(page, message.author);
      const newButtons = createButtons(page);

      interaction.update({ embeds: [newEmbed], components: newButtons });
    });

    collector.on("end", () => {
      helpMessage.edit({ components: [] }).catch(() => {});
    });
  },
};
