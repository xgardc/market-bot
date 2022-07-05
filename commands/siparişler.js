const { MessageEmbed } = require('discord.js');
const { createCommand } = require('../utils');
const Order = require('../firebase/Order');

module.exports = async () =>
  createCommand({
    name: 'siparişler',
    description: 'Siparişleri görüntüler.',
    async execute(interaction) {
      if (
        !interaction.client.config.owners.some(
          (owner) => owner === interaction.member.id
        )
      )
        return await interaction.followUp('Bu komutu kullanamazsın.');

      const orders = await Order.getAll();

      const embed = new MessageEmbed();
      orders.forEach((order) => {
        embed.addField(
          `${
            interaction.guild.members.cache.find(
              (member) => member.id === order.owner
            ).user.tag
          } (Sipariş kodu: ${order.id})`,
          order.order
        );
      });

      await interaction.followUp({ embeds: [embed] });
    },
  });
