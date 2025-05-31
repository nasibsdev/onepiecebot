const { EmbedBuilder } = require("discord.js");
const { getBalance, getResetTokens } = require("../op/currency");

module.exports = {
  name: "balance",
  description: "Check your current beli balance and reset tokens.",
  async execute(message) {
    const userId = message.author.id;
    const username = message.author.username;
    const beli = getBalance(userId);
    const tokens = getResetTokens(userId);
    const pfp = message.author.displayAvatarURL({ dynamic: true });

    const embed = new EmbedBuilder()
      .setTitle(`**${username}'s Wallet**`)
      .setDescription(
        `**wallet:**\n` +
        `beli: **${beli.toLocaleString()}** <:Money:1375579299565928499>\n` +
        `reset tokens: **${tokens}** <:icon1:1375589270013608206>`
      )
      .setColor("#fde68a")
      .setThumbnail(pfp)
      .setFooter({
        text: "One Piece Bot • op help",
        iconURL: message.client.user.displayAvatarURL(),
      })
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  },
};
