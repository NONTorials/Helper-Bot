const Command = require('../../Class/Command.js');
const { RichEmbed, Message } = require('eris-pluris');
const axios = require('axios');

module.exports = class CommandName extends Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      aliases: ['u', 'ui', 'user'],
      description: 'Da la información básica de un usuario.',
      usage: 'userinfo <mention-user>',
      example: 'userinfo 686766483350880351',
      category: 'Utility',
      PermissionsBot: ['viewChannel', 'sendMessages', 'embedLinks'],
      PermissionsUser: [],
      cooldown: 4,
      nsfw: false,
      args: true,
      dev: false,
      enable: true,
    });
  }
  /**
   *
   * @param {Message} message
   */
  async run(message, args) {
    const client = this.client;
    try {
      const user = args[0] ? client.users.get(message.mentions[0]?.id) || await client.getRESTUser(args[0]).catch(() => {}) || message.author : message.author;

      const arrayUser = [
        `\`Nombre de usuario:\` ${user.username}`,
        `\`Discriminador:\` #${user.discriminator}`,
        `\`Identificador:\` ${user.id}`,
        `\`Fecha de creación de la cuenta:\` <t:${Math.round(user.createdAt / 1000)}:F>`,
      ];

      const embed = new RichEmbed()
        .setThumbnail(user.dynamicAvatarURL())
        .addField(`Información del usuario:`, arrayUser.join('\n'))
        .setColor(client.color);

      const data = (await axios.get(`https://discord.com/api/v9/users/${user.id}`, {
        headers: {
          'Authorization': client._token
        }
      }).catch(() => {}) || undefined)?.data

      if (data) {
        const url = data.banner
        ? `https://cdn.discordapp.com/banners/${user.id}/${data.banner}.${data.banner.startsWith('a_') ? 'gif' : 'png'}?size=1024`
        : (data.banner_color ? `https://dummyimage.com/600x121/${data.banner_color.slice(1)}/${data.banner_color.slice(1)}.png` : null);
        if (url) {
          embed.setImage(url);
        }
      }

      const member = message.guild.members.get(user.id)

      if (member) {
        const roles = member.roles
          .filter((x) => x.id !== message.guild.id)
          .map((x) => message.guild.roles.get(x))
          .sort((a, b) => b.position - a.position)
          .map((x) => `<@&${x.id}>`);
  
        const listaRoles = roles.length > 10
            ? `${roles.slice(0, 10).join(', ')} y **${roles.length - 10}** roles más`
            : roles.join(', ');
  
        const arrayMember = [
          `\`Apodo:\` ${member.nick || 'Ninguno'}`,
          `\`Fecha de unión:\` <t:${Math.round(member.joinedAt / 1000)}:F>`,
          `\`Roles:\` ${listaRoles || 'No tiene'}`,
        ];

        embed.addField(`Información del miembro:`, arrayMember.join('\n'))
      }

      message.channel.createMessage({ embed });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, 'js')
      );
    }
  }
};
