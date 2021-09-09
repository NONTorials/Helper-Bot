const Command = require("../../Class/Command.js");
const Eris = require("eris-pluris");

module.exports = class ServerIcon extends Command {
  constructor(client) {
    super(client, {
      name: "servericon",
      aliases: ["icon", "svi"],
      description: "Muestra el ícono del servidor.",
      usage: "servericon",
      example: "servericon",
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
      const embed_servericon = new Eris.RichEmbed()
        .setDescription(`Ícono de \`${message.guild.name}\`.`)
        .setColor(client.color)
        .setImage(message.guild.dynamicIconURL());
      client.createMessage(message.channel.id, { embed: embed_servericon });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
