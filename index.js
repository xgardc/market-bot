const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const {
  token,
  guild,
  owners,
  channel,
  category,
  customerService,
} = require('./config.json');
const { promises: fs } = require('fs');
const { remove } = require('./firebase/Order');
const Product = require('./firebase/Product');

if (!token || !guild || !owners || !channel || !category || !customerService) {
  console.error('Missing config.json');
  process.exit(1);
}

const client = new Client({ intents: new Intents(32767) });

client.commands = new Collection();
client.config = { guild, owners, channel, category, customerService };

client.login(token);

fs.readdir('commands')
  .then((files) => {
    files.forEach(async (file) => {
      const command = require(`./commands/${file}`);
      const commandData = await command();

      client.commands.set(commandData.name, commandData);
    });
  })
  .then(() => {
    client.on('ready', async () => {
      for (const command of client.commands.values()) {
        await client.guilds.cache.get(guild).commands.create(command);
      }
      console.log('Commands are loaded!');
    });
  })
  .catch(console.error);

client.on('interactionCreate', async (interaction) => {
  if (interaction.member.user.bot) return;
  if (interaction.isCommand()) {
    await interaction.deferReply({ ephemeral: true });

    const command = interaction.client.commands.get(interaction?.command?.name);

    if (!command) return interaction.followUp('Komut bulunamadı.');

    try {
      await command.execute(interaction);
    } catch (e) {
      interaction.followUp(`Bir hata oluştu: ${e.message}`);
      console.error(e);
    }
  }
  if (interaction.isButton()) {
    const splittedButtonId = interaction.customId.split('-');
    const orderKey = interaction.message.embeds[0].description
      .split('\n')
      .at(1)
      .replaceAll('```', '')
      .trim();

    const order = interaction.message.embeds[0].description
      .split('\n')
      .at(3)
      .replaceAll('```', '')
      .trim();

    const memberIdWithTags =
      interaction.message.embeds[0].description.split(' ')[0];
    const memberId = memberIdWithTags.substring(2, memberIdWithTags.length - 1);

    switch (splittedButtonId[0]) {
      case 'confirm':
        const channel = await interaction.guild.channels.create(
          `sipariş-${orderKey}`,
          {
            parent: category,
            permissionOverwrites: [
              { id: interaction.guild.id, deny: ['VIEW_CHANNEL'] },
              { id: customerService, allow: ['VIEW_CHANNEL'] },
              {
                id: memberId,
                allow: ['VIEW_CHANNEL'],
              },
            ],
          }
        );

        const products = await Product.getAll();

        const product = products.find((product) => product.product === order);

        const embed = new MessageEmbed();
        embed
          .setTitle(
            `Siparişiniz onaylandı! (${order} ${product.price}₺)
          `
          )
          .setDescription(
            `Bu kanalı kullanarak siparişiniz hakkında bilgi alabilirsiniz.`
          )
          .addField('Siparişi etmek için', '/sipariş-iptal')
          .addField(
            'Ürünü aldıktan sonra siparişi tamamla için',
            '/sipariş-tamamla'
          );

        await channel.send({
          embeds: [embed],
          content: `${memberIdWithTags} <@&${customerService}>`,
        });

        break;
      case 'delete':
        await remove(orderKey);
        break;
    }
    interaction.message.delete();
  }
});
