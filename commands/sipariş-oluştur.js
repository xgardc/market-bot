const { createCommand } = require('../utils');
const Order = require('../firebase/Order');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Product = require('../firebase/Product');

module.exports = async () => {
  const products = await Product.getAll();

  const choices = products.map((product) => ({
    name: product.product,
    value: product.product,
  }));

  return createCommand({
    name: 'sipariş-oluştur',
    description: 'Sipariş oluşturur.',
    options: [
      {
        name: 'sipariş',
        type: 'STRING',
        description: 'Siparişinizi yazınız.',
        required: true,
        choices,
      },
    ],
    async execute(interaction) {
      if (
        !interaction.guild.commands.cache.find(
          (command) => command.name === this.name
        ).options[0].choices?.length
      )
        return await interaction.followUp('Ürün bulunamadı.');
      const order = interaction.options.getString('sipariş');
      const _order = new Order({ order, owner: interaction.member.id });
      await _order.save();

      const embed = new MessageEmbed()
        .setTitle('Yeni bir sipariş var!')
        .setDescription(
          `<@${_order.owner}> kullanıcısı bir sipariş oluşturdu, sipariş kodu:
        \`\`\`${_order.id}\`\`\`
        Siparişin içeriği:
        \`\`\`${_order.order}\`\`\``
        )
        .setTimestamp(Date.now());

      const button = new MessageActionRow().addComponents([
        new MessageButton()
          .setCustomId('confirm')
          .setLabel('Onayla')
          .setStyle('SUCCESS'),
        new MessageButton()
          .setCustomId('delete')
          .setLabel('Kaldır')
          .setStyle('DANGER'),
      ]);

      await interaction.client.channels.cache
        .get(interaction.client.config.channel)
        .send({ embeds: [embed], components: [button] });

      await interaction.followUp('Siparişiniz oluşturuldu.');
    },
  });
};
