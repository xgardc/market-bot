const { createCommand } = require('../utils');
const Product = require('../firebase/Product');

module.exports = async () =>
  createCommand({
    name: 'ürün-oluştur',
    description: 'Ürün oluşturur.',
    options: [
      { name: 'ürün', description: 'Ürün adı', type: 'STRING', required: true },
      {
        name: 'fiyat',
        description: 'Ürün fiyatı',
        type: 'NUMBER',
        required: true,
      },
    ],
    async execute(interaction) {
      if (
        !interaction.client.config.owners.some(
          (owner) => owner === interaction.member.id
        )
      )
        return await interaction.followUp('Bu komutu kullanamazsın.');

      const productName = interaction.options.getString('ürün');
      const productPrice = interaction.options.getNumber('fiyat');
      const product = new Product({
        product: productName,
        price: productPrice,
      });
      await product.save();
      const products = await Product.getAll();

      const choices = products.map((product) => ({
        name: product.product,
        value: product.product,
      }));

      await interaction.client.guilds.cache
        .get(interaction.client.config.guild)
        .commands.cache.find((command) => command.name === 'sipariş-oluştur')
        .edit({
          options: [
            {
              name: 'sipariş',
              type: 'STRING',
              description: 'Siparişinizi yazınız.',
              required: true,
              choices,
            },
          ],
        });
      await interaction.followUp('Ürün oluşturuldu.');
    },
  });
