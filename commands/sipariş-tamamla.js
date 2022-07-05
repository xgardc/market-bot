const { MessageEmbed } = require('discord.js');
const { createCommand } = require('../utils');
const Order = require('../firebase/Order');

module.exports = async () =>
  createCommand({
    name: 'sipariş-tamamla',
    description: 'Siparişi tamamlar.',
    async execute(interaction) {
      if (
        !interaction.client.config.owners.some(
          (owner) => owner === interaction.member.id
        ) ||
        !interaction.member.roles.cache.find(
          (role) => role.id === interaction.client.config.customerService
        )
          ? false
          : true
      )
        return await interaction.followUp('Bu komutu kullanamazsın.');

      if (!interaction.channel.name.startsWith('sipariş-'))
        return await interaction.followUp(
          'Bu komutu sadece sipariş kanallarında kullanabilirsin.'
        );

      const splittedName = interaction.channel.name.split('-');

      splittedName.shift();

      const orderKey = splittedName.join('-');

      const orders = await Order.getAll(orderKey);
      const order = orders.find((order) => order.id === orderKey);

      await Order.remove(orderKey);

      const embed = new MessageEmbed();
      embed
        .setTitle('Siparişiniz onaylandı!')
        .setDescription('Bizi tercih ettiğiniz için teşekkür ederiz.')
        .setColor('#4BB543');

      await interaction.followUp('Müşteriyle ilgilendiğin için teşekkürler!');

      interaction.channel.send({ embeds: [embed] }).then(() =>
        setTimeout(
          () =>
            interaction.channel.permissionOverwrites.edit(order.owner, {
              VIEW_CHANNEL: false,
            }),
          10000
        )
      );
    },
  });
