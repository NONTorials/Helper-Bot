const Command = require("../../Class/Command.js");
const Eris = require("eris-pluris");

module.exports = class Snipe extends Command {
  constructor(client) {
    super(client, {
      name: "snipe",
      aliases: ["ms"],
      description: "Muestra los mensajes eliminados.",
      usage: "snipe (page)",
      example: "snipe 3",
      category: "Utility",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: [],
      cooldown: 4,
      nsfw: false,
      args: true,
      dev: false,
      enable: true,
    });
  }
  async run(message, args) {
    const client = this.client;
    try {
      const guildSnipes = client.snipes.get(message.channel.id) || [];
      const msg = guildSnipes[args[0] - 1 || 0];
      if (!msg)
        return message.channel.createMessage(
          "No hay ningún mensaje eliminado."
        );

      const array = [
        `ID del mensaje: \`${msg.message_id}\`.`,
        `Fecha: <t:${Math.round(msg.date / 1000)}:d> <t:${Math.round(
          msg.date / 1000
        )}:T>`,
        `Mensaje número: \`${args[0] || 1}/${guildSnipes.length}\`.`,
      ];
      if (msg.content.length >= 2047)
        msg.content = `${msg.content.substr(0, 2000)}...`;

      const embed_success = new Eris.RichEmbed();
      embed_success.setAuthor(
        `${msg.author.username}#${msg.author.discriminator}`,
        undefined,
        msg.author.dynamicAvatarURL()
      );
      embed_success.setDescription(msg.content);
      embed_success.setColor(client.color);
      if (msg.attachments.length) {
        embed_success.addField(
          "Archivo Adjunto:",
          `[${msg.attachment_name}](${msg.attachment_url}) \`${Math.round(
            msg.attachment_size
          )}kb\`.`
        );
      }
      embed_success.addField("Información:", array.join("\n"));
      await message.channel.createMessage({ embed: embed_success });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
