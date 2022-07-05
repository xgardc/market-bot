const {
  CommandInteraction,
  ApplicationCommandOptionData,
  PermissionResolvable,
} = require('discord.js');

/** @param {{name: string, description: string, options: ApplicationCommandOptionData[], userPermissions: PermissionResolvable, execute: (interaction: CommandInteraction) => any}} */
module.exports = ({
  name,
  description,
  options,
  userPermissions,
  execute,
}) => ({
  name,
  description,
  options,
  userPermissions,
  execute,
});
