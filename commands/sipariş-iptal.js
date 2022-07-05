const { MessageEmbed } = require('discord.js');
const { createCommand } = require('../utils');
const Order = require('../firebase/Order');

module.exports = async () =>
  createCommand({
    name: 'sipariş-iptal',
    description: 'Siparişi iptal eder.',
    async execute(interaction) {
      if (!interaction.channel.name.startsWith('sipariş-'))
        return await interaction.followUp(
          'Bu komutu sadece sipariş kanallarında kullanabilirsin.'
        );

      const splittedName = interaction.channel.name.split('-');

      splittedName.shift();

      const orderKey = splittedName.join('-');

      const orders = await Order.getAll(orderKey);

      const order = orders.find((order) => order.id === orderKey);

      if (
        !interaction.client.config.owners.some(
          (owner) => owner === interaction.member.id
        ) ||
        !interaction.member.roles.cache.find(
          (role) => role.id === interaction.client.config.customerService
        )
          ? false
          : true || order.owner !== interaction.member.id
      )
        return await interaction.followUp(
          'Bu komutu sadece sipariş sahibi veya müşteri hizmetleri kişiler kullanabilir.'
        );

      await Order.remove(orderKey);

      const embed = new MessageEmbed();
      embed
        .setTitle('Siparişiniz iptal edildi!')
        .setDescription('Bizi tercih ettiğiniz için teşekkür ederiz.')
        .setColor('#7a0012');

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
