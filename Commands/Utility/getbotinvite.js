const Command = require("../../Class/Command.js");
const { RichEmbed } = require("eris-pluris");

module.exports = class GetBotInvite extends Command {
  constructor(client) {
    super(client, {
      name: "getbotinvite",
      aliases: [],
      description: "Genera una invitación para el bot mencionado.",
      usage: "getbotinvite <bot-user>",
      example: "getbotinvite <@!721080193678311554>",
      category: "Utility",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: [],
      cooldown: 3,
      nsfw: false,
      args: true,
      dev: false,
      enable: true,
    });
  }
  async run(message, args) {
    const client = this.client;
    try {
      const user = args[0] ? client.users.get(message.mentions[0]?.id) || await client.getRESTUser(args[0]).catch(() => {}) || message.author : message.author;
      if (!user)
        return client.createMessage(
          message.channel.id,
          `Debes mencionar al bot el cual deseas generar la invitación.`
        );

      if (!user.bot)
        return client.createMessage(
          message.channel.id,
          `Debes mencionar únicamente a un bot.`
        );

      const link_no_permisos = `https://discordapp.com/oauth2/authorize?client_id=${user.id}&scope=bot&permissions=0`;
      const link_con_permisos_8 = `https://discordapp.com/oauth2/authorize?client_id=${user.id}&scope=bot&permissions=8`;

      const embed_link = new RichEmbed()
        .setAuthor(user.username, undefined, user.dynamicAvatarURL())
        .setThumbnail(user.dynamicAvatarURL())
        .setColor(client.color)
        .setDescription(
          `Link sin permisos: [Click aquí](${link_no_permisos}).\nLink con permiso de administrador: [Click aquí](${link_con_permisos_8}).`
        );
      client.createMessage(message.channel.id, { embed: embed_link });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
}
