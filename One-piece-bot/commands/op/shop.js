module.exports = {
  name: "shop",
  description: "View the shop and prices for all items!",

  async execute(message) {
    const shopItems = [
      { name: "Reset Token", price: 5000 },
      { name: "C Tier Chest", price: 500 },
      { name: "B Tier Chest", price: 2500 },
      { name: "A Tier Chest", price: 5000 },
      { name: "S Tier Chest", price: 20000 },
      { name: "SS Tier Chest", price: 50000 },
      { name: "UR Tier Chest", price: 100000 },
      { name: "Summoning SS Fragment", price: 1000000 },
      { name: "Summoning UR Fragment", price: 1000000 },
      { name: "Armament Haki Plate", price: 500000 },
      { name: "Observation Haki Plate", price: 500000 },
      { name: "Conqueror's Haki Plate", price: 500000 },
    ];

    const embed = {
      color: 0x22c55e,
      title: "<:namirich:1375662701702807632> OP SHOP",
      description: `Spend your **Beli** to buy items and grow stronger!\n\nUse \`op buy <item name>\` to purchase something.`,
      fields: shopItems.map((item) => ({
        name: item.name,
        value: `<:Money:1375579299565928499> ${item.price.toLocaleString()} Beli`,
        inline: true,
      })),
      footer: {
        text: "More items may be added in the future!",
      },
      timestamp: new Date(),
    };

    await message.reply({ embeds: [embed] });
  },
};
