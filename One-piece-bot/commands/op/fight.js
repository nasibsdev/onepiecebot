const fs = require("fs");
const path = require("path");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "fight",
  description: "Challenge someone to a duel!",
  async execute(message) {
    const opponent = message.mentions.users.first();
    const challenger = message.author;

    if (!opponent || opponent.bot || opponent.id === challenger.id) {
      return message.channel.send(
        "Mention a valid player to fight (not a bot or yourself).",
      );
    }
    let turn = 0;
    // Load user collections
    const collectionPath = path.join(
      __dirname,
      "../../data/userCollection.json",
    );
    if (!fs.existsSync(collectionPath)) {
      return message.channel.send("User collections data missing.");
    }
    const collections = JSON.parse(fs.readFileSync(collectionPath, "utf8"));
    
      function aliveCards(team) {
        return team.filter(card => card.hp > 0);
      }
    // Helper to get team array with stats, applying haki boosts
    function getUserTeam(userId) {
      const userData = collections[userId];
      if (!userData || !userData.team) return [];

      return userData.team.map((cardName) => {
        const card = userData[cardName];
        if (!card) return null;

        const hakiBonus = card.haki || { strength: 0, speed: 0, hp: 0 };

        // Base stats
        let basePower = card.power || 0;
        let baseSpeed = card.speed || 0;
        let baseHp = card.health || 100;

        // Apply Haki Plate boosts
        if (card.plates) {
          if (card.plates.armament) {
            basePower = Math.floor(basePower * 1.2);
          }
          if (card.plates.conqueror) {
            basePower = Math.floor(basePower * 1.07);
            baseSpeed = Math.floor(baseSpeed * 1.07);
            baseHp = Math.floor(baseHp * 1.07);
          }
          if (card.plates.observation) {
            baseSpeed = Math.floor(baseSpeed * 1.1);
            baseHp = Math.floor(baseHp * 1.1);
          }
        }

        return {
          name: cardName,
          rank: card.rank,
          strength: basePower + (hakiBonus.strength || 0),
          speed: baseSpeed + (hakiBonus.speed || 0),
          hp: baseHp + (hakiBonus.hp || 0),
          maxHp: baseHp + (hakiBonus.hp || 0),
          image: card.image || null,
        };
      }).filter(Boolean);
    }

    // Then call these ONCE after defining getUserTeam:
    const challengerTeam = getUserTeam(challenger.id);
    const opponentTeam = getUserTeam(opponent.id);

    const challengerClone = JSON.parse(JSON.stringify(challengerTeam));
    const opponentClone = JSON.parse(JSON.stringify(opponentTeam));


    // Create tiny HP bar string (length 10)
    function hpBar(current, max) {
      const totalBars = 10;
      const filledBars = Math.round((current / max) * totalBars);
      const emptyBars = totalBars - filledBars;
      return "🟥".repeat(filledBars) + "⬜".repeat(emptyBars);
    }

    // Create embed for current fight state
    function createFightEmbed() {
      const embed = new EmbedBuilder()
        .setTitle("⚔️ Duel Time! ⚔️")
        .setDescription(
          `**${challenger.username}** vs **${opponent.username}**`,
        )
        .setColor(turn === 0 ? 0x1abc9c : 0xe74c3c);

      // Show each team with card image thumbnails, HP bars, and strength/speed
      function formatTeam(team) {
        if (team.length === 0) return "All defeated";

        return team
          .map((c) => {
            // Use markdown to align image and text nicely with embed thumbnail
            return `**${c.name}**\n${hpBar(c.hp, c.maxHp)}  | STR: ${c.strength} | SPD: ${c.speed}`;
          })
          .join("\n\n");
      }

      embed.addFields(
        {
          name: `${challenger.username}'s Team`,
          value: formatTeam(aliveCards(challengerClone)) || "All defeated",
        },
        {
          name: `${opponent.username}'s Team`,
          value: formatTeam(aliveCards(opponentClone)) || "All defeated",
        },
      );

      // Add thumbnail of current player's first alive card (circular by Discord UI)
      const currentPlayerTeam = turn === 0 ? challengerClone : opponentClone;
      const firstAliveCard = aliveCards(currentPlayerTeam)[0];
      if (firstAliveCard && firstAliveCard.image) {
        embed.setThumbnail(firstAliveCard.image);
      }

      embed.setFooter({
        text: `Turn: ${turn === 0 ? challenger.username : opponent.username}`,
      });

      return embed;
    }

    // Create buttons for attacking enemy alive cards
    function createAttackButtons() {
      const enemyTeam = turn === 0 ? opponentClone : challengerClone;
      const aliveEnemyCards = aliveCards(enemyTeam);

      const row = new ActionRowBuilder();

      aliveEnemyCards.forEach((card, idx) => {
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`attack_${idx}`)
            .setLabel(card.name)
            .setStyle(ButtonStyle.Primary)
            .setEmoji("⚔️"),
        );
      });

      // Add cancel button as well
      row.addComponents(
        new ButtonBuilder()
          .setCustomId("cancel")
          .setLabel("Cancel Duel")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("🛑"),
      );

      return row;
    }

    // Send initial fight message with buttons to pick enemy card
    const fightMessage = await message.channel.send({
      embeds: [createFightEmbed()],
      components: [createAttackButtons()],
    });

    // Filter for only duel players
    const filter = (i) => [challenger.id, opponent.id].includes(i.user.id);

    // Duel timeout (20 seconds)
    const duelTimeoutMs = 20000;
    let timeout;

    // Reset timeout helper
    function resetTimeout() {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        await fightMessage.channel.send(
          `⏰ Time's up! ${turn === 0 ? challenger : opponent} took too long. Duel forfeited.`,
        );
        collector.stop("timeout");
      }, duelTimeoutMs);
    }

    resetTimeout();

    // Button collector for attack and cancel
    const collector = fightMessage.createMessageComponentCollector({
      filter,
      time: 5 * 60 * 1000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== (turn === 0 ? challenger.id : opponent.id)) {
        await i.reply({ content: "It's not your turn!", ephemeral: true });
        return;
      }

      resetTimeout();

      if (i.customId === "cancel") {
        await fightMessage.channel.send("🛑 Duel canceled by a player.");
        collector.stop("canceled");
        await i.update({ components: [] });
        return;
      }

      // Attack buttons: format attack_<index>
      if (i.customId.startsWith("attack_")) {
        const enemyIdx = parseInt(i.customId.split("_")[1]);
        const attackerTeam = turn === 0 ? challengerClone : opponentClone;
        const defenderTeam = turn === 0 ? opponentClone : challengerClone;

        const aliveAttackers = aliveCards(attackerTeam);
        const aliveDefenders = aliveCards(defenderTeam);

        if (!aliveAttackers.length || !aliveDefenders.length) {
          collector.stop("finished");
          return;
        }

        // Pick attacker card with highest speed (to flex)
        aliveAttackers.sort((a, b) => b.speed - a.speed);
        const attackerCard = aliveAttackers[0];

        // Validate chosen defender index
        if (enemyIdx >= aliveDefenders.length) {
          await i.reply({ content: "Invalid target.", ephemeral: true });
          return;
        }

        const defenderCard = aliveDefenders[enemyIdx];

        // Calculate damage = strength + random between 0 and 0.5*strength
        const damage = Math.floor(
          attackerCard.strength + Math.random() * (0.5 * attackerCard.strength),
        );
        defenderCard.hp -= damage;
        if (defenderCard.hp < 0) defenderCard.hp = 0;

        // Announce attack
        await i.update({
          content: `**${attackerCard.name}** attacks **${defenderCard.name}** for **${damage}** damage!`,
          embeds: [createFightEmbed()],
          components: [createAttackButtons()],
        });

        // Check if defender fainted
        if (defenderCard.hp <= 0) {
          await fightMessage.channel.send(
            `💥 **${defenderCard.name}** has been defeated!`,
          );
          }

          let duelFinished = false; // place this outside the collector, near the start of your duel logic
          
          // Check if duel ended
          function checkEnd() {
            const challengerAliveCount = aliveCards(challengerClone).length;
            const opponentAliveCount = aliveCards(opponentClone).length;

            if (challengerAliveCount === 0) return opponent.id;
            if (opponentAliveCount === 0) return challenger.id;
            return null;
          }

          const winnerId = checkEnd();
          if (winnerId) {
            duelFinished = true; // <- mark duel as finished here
            const winner = winnerId === challenger.id ? challenger : opponent;
            await fightMessage.channel.send(
              `🏆 **${winner.username}** wins the duel!`,
            );

            // Add rewards here
          }


          // Add rewards here:
          const balancePath = path.join(__dirname, "../../data/userBalance.json");
          const balances = fs.existsSync(balancePath)
            ? JSON.parse(fs.readFileSync(balancePath, "utf8"))
            : {};

          if (!balances[winner.id]) balances[winner.id] = { beli: 0 };
          balances[winner.id].beli += 100;
          fs.writeFileSync(balancePath, JSON.stringify(balances, null, 2));

          if (!collections[winner.id]) collections[winner.id] = { team: [] };

          function chance(percent) {
            return Math.random() < percent / 100;
          }

          let chestMsg = "";
          if (chance(50)) {
            collections[winner.id].c_chest = (collections[winner.id].c_chest || 0) + 1;
            chestMsg += "You got a **C Chest**! ";
          }
          if (chance(20)) {
            collections[winner.id].b_chest = (collections[winner.id].b_chest || 0) + 1;
            chestMsg += "You got a **B Chest**! ";
          }
          fs.writeFileSync(collectionPath, JSON.stringify(collections, null, 2));

          await fightMessage.channel.send(
            `💰 You earned **100 Beli**! ${chestMsg}`.trim()
          );

          collector.stop("finished");
          await i.editReply({ components: [] });
          return;

        

        // Switch turn
        turn = 1 - turn;
      }
    });

    collector.on("end", async (collected, reason) => {
      if (reason === "timeout" && !duelFinished) {
        await message.channel.send("⏰ Duel ended due to inactivity.");
      }

      try {
        await fightMessage.edit({ components: [] });
      } catch {}
    });
  },
};
