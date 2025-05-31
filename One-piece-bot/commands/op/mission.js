const fs = require("fs");
const path = require("path");
const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const triviaQuestions = [
  {
    question: "What is the name of Luffy's first ship?",
    options: { A: "Going Merry", B: "Thousand Sunny", C: "Red Force", D: "Moby Dick" },
    answer: "A",
  },
  {
    question: "What Devil Fruit power does Nico Robin have?",
    options: { A: "Clone-Clone Fruit", B: "Flower-Flower Fruit", C: "Bloom-Bloom Fruit", D: "Petal-Petal Fruit" },
    answer: "B",
  },
  {
    question: "Who is the first Straw Hat crew member Luffy recruits?",
    options: { A: "Nami", B: "Zoro", C: "Usopp", D: "Sanji" },
    answer: "B",
  },
  {
    question: "What is the name of the sea where the story begins?",
    options: { A: "North Blue", B: "South Blue", C: "East Blue", D: "Grand Line" },
    answer: "C",
  },
  {
    question: "What type of Devil Fruit does Luffy eat?",
    options: { A: "Logia", B: "Zoan", C: "Mythical Zoan", D: "Paramecia" },
    answer: "C",
  },
  {
    question: "Who is the captain of the Red Hair Pirates?",
    options: { A: "Shanks", B: "Buggy", C: "Whitebeard", D: "Kaido" },
    answer: "A",
  },
  {
    question: "What island is home to Dr. Vegapunk's lab?",
    options: { A: "Punk Hazard", B: "Egghead", C: "Ohara", D: "Enies Lobby" },
    answer: "B",
  },
  {
    question: "Who killed Ace during the Marineford War?",
    options: { A: "Blackbeard", B: "Akainu", C: "Kizaru", D: "Aokiji" },
    answer: "B",
  },
  {
    question: "What is the name of Sanji's fighting style?",
    options: { A: "Fish-Man Karate", B: "Electro", C: "Black Leg Style", D: "Rokushiki" },
    answer: "C",
  },
  {
    question: "Which race is King the Wildfire?",
    options: { A: "Fish-Man", B: "Giant", C: "Skypiean", D: "Lunarian" },
    answer: "D",
  },
];

const chestChances = [
  { rank: "C", chance: 0.8 },
  { rank: "B", chance: 0.15 },
  { rank: "A", chance: 0.05 },
];

function pickChest() {
  const rand = Math.random();
  let sum = 0;
  for (const chest of chestChances) {
    sum += chest.chance;
    if (rand <= sum) return chest.rank;
  }
  return "C";
}

function pickFinalChest() {
  return Math.random() <= 0.3 ? "S" : "A";
}

function readJSON(filepath) {
  return fs.existsSync(filepath) ? JSON.parse(fs.readFileSync(filepath, "utf8")) : {};
}

function writeJSON(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

const missionFilePath = path.join(__dirname, "../../data/mission.json");
const currencyFilePath = path.join(__dirname, "../../data/userCurrency.json");
const inventoryFilePath = path.join(__dirname, "../../data/userInventory.json");

module.exports = {
  name: "mission",
  description: "Complete a One Piece trivia mission for rewards!",
  async execute(message) {
    const userId = message.author.id;
    const avatarURL = message.author.displayAvatarURL({ dynamic: true, size: 64 });

    const missions = readJSON(missionFilePath);
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;

    if (!missions[userId]) {
      missions[userId] = { count: 0, correct: 0, lastCompleted: 0 };
    }

    if (missions[userId].count >= 5) {
      const timeSinceLastComplete = now - missions[userId].lastCompleted;
      if (timeSinceLastComplete < cooldown) {
        const timeLeft = cooldown - timeSinceLastComplete;
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        return message.reply(`🕒 You completed 5 missions today. New missions unlock in ${hours}h ${minutes}m.`);
      } else {
        missions[userId] = { count: 0, correct: 0, lastCompleted: 0 };
      }
    }

    const question = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];

    const embed = new EmbedBuilder()
      .setTitle("🎯 Mission Time!")
      .setDescription(`**Question:**\n${question.question}`)
      .addFields(
        { name: "A", value: question.options.A, inline: true },
        { name: "B", value: question.options.B, inline: true },
        { name: "C", value: question.options.C, inline: true },
        { name: "D", value: question.options.D, inline: true }
      )
      .setColor("#f59e0b")
      .setFooter({ text: `Mission ${missions[userId].count + 1}/5` })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      ["A", "B", "C", "D"].map((label) =>
        new ButtonBuilder().setCustomId(label).setLabel(label).setStyle(ButtonStyle.Primary)
      )
    );

    const sent = await message.channel.send({ embeds: [embed], components: [row] });

    const filter = (i) => i.user.id === userId;
    const collector = sent.createMessageComponentCollector({ filter, time: 30000, max: 1 });

    collector.on("collect", async (interaction) => {
      await interaction.deferUpdate();
      const answer = interaction.customId;
      const correct = answer === question.answer;

      missions[userId].count++;
      if (correct) missions[userId].correct++;

      const currency = readJSON(currencyFilePath);
      const inventory = readJSON(inventoryFilePath);

      currency[userId] ??= { beli: 0, tokens: 0 };
      inventory[userId] ??= {};

      let resultEmbed;
      let rewardText = "";

      if (correct) {
        const chest = pickChest();
        const beli = Math.floor(Math.random() * 151) + 50;

        currency[userId].beli += beli;
        inventory[userId][`${chest} Tier Chest`] = (inventory[userId][`${chest} Tier Chest`] || 0) + 1;

        rewardText = `You received:\n<:Chest:1375599735854989403> **${chest} Tier Chest**\n<:Money:1375579299565928499> **${beli} Beli**`;

        if (missions[userId].count === 5 && missions[userId].correct === 5) {
          const finalChest = pickFinalChest();
          inventory[userId][`${finalChest} Tier Chest`] = (inventory[userId][`${finalChest} Tier Chest`] || 0) + 1;
          currency[userId].resetTokens += 1;
          rewardText += `\n\n🎉 BONUS REWARD for 5/5 correct:\n<:Chest:1375599735854989403> **${finalChest} Tier Chest**\n<:icon1:1375589270013608206> **1 Reset Token**`;
        }

        resultEmbed = new EmbedBuilder()
          .setTitle("<:sucess:1375872950321811547> Correct Answer!")
          .setDescription(rewardText)
          .setColor("#22c55e")
          .setThumbnail(avatarURL)
          .setTimestamp();
      } else {
        resultEmbed = new EmbedBuilder()
          .setTitle("❌ Incorrect Answer")
          .setDescription(`The correct answer was **${question.answer}**.`)
          .setColor("#ef4444")
          .setThumbnail(avatarURL)
          .setTimestamp();
      }

      if (missions[userId].count === 5) {
        missions[userId].lastCompleted = now;
      }

      const disabledRow = new ActionRowBuilder().addComponents(
        ["A", "B", "C", "D"].map((label) =>
          new ButtonBuilder()
            .setCustomId(label)
            .setLabel(label)
            .setStyle(
              label === answer
                ? correct
                  ? ButtonStyle.Success
                  : ButtonStyle.Danger
                : ButtonStyle.Secondary
            )
            .setDisabled(true)
        )
      );

      writeJSON(missionFilePath, missions);
      writeJSON(currencyFilePath, currency);
      writeJSON(inventoryFilePath, inventory);

      await sent.edit({ embeds: [resultEmbed], components: [disabledRow] });
    });

collector.on("end", async (collected) => {
  if (collected.size === 0) {
    const timeoutRow = new ActionRowBuilder().addComponents(
      ["A", "B", "C", "D"].map((label) =>
        new ButtonBuilder()
          .setCustomId(label)
          .setLabel(label)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
      )
    );

    const timeoutEmbed = EmbedBuilder.from(embed)
      .setFooter({ text: "⏱️ Time’s up! You didn’t answer in time." })
      .setColor("#9ca3af");

    await sent.edit({ embeds: [timeoutEmbed], components: [timeoutRow] });
  }
});
    },
    };