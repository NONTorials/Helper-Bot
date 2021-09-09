const Command = require("../../Class/Command.js");
const { RichEmbed } = require("eris-pluris");

module.exports = class Avatar extends Command {
  constructor(client) {
    super(client, {
      name: "avatar",
      aliases: ["av"],
      description: "Muestra el avatarde un usuario.",
      usage: "avatar",
      example: "avatar",
      category: "Utility",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: [],
      cooldown: 3,
      nsfw: false,
      args: false,
      dev: false,
      enable: true,
    });
  }
  async run(message, args) {
    const client = this.client;
    try {
      const user = args[0] ? client.users.get(message.mentions[0]?.id) || await client.getRESTUser(args[0]).catch(() => {}) || message.author : message.author;
      const embed_avatar = new RichEmbed()
        .setDescription(`Avatar de \`${user.username}\`.`)
        .setColor(client.color)
        .setImage(user.dynamicAvatarURL());
      client.createMessage(message.channel.id, { embed: embed_avatar });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
