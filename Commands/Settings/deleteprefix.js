const Command = require("../../Class/Command.js");
const SchemaPrefix = require("../../Database/Schema/CustomPrefix.js");

module.exports = class DeletePrefix extends Command {
  constructor(client) {
    super(client, {
      name: "deleteprefix",
      aliases: ["resetprefix", "dp"],
      description: "Elimina el prefijo personalizado en el servidor.",
      usage: "deleteprefix",
      example: "deleteprefix",
      category: "Settings",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: ["manageGuild"],
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
      const permissions = message.guild.permissionsOf(message.member.id);

      if (!permissions.has("manageGuild"))
        return message.channel.createMessage(
          `No cuentas con el permiso necesario para ejecutar el comando.\nPermiso necesario \`manageGuild\`.`
        );

      const Borrar_Prefix = await SchemaPrefix.findOneAndDelete({
        guildID: message.guild.id,
      });
      if (!Borrar_Prefix)
        return message.channel.createMessage(
          `No hay un prefix personalizado en el servidor.`
        );

      message.channel.createMessage(
        `El prefijo ha sido restablecido, el prefix actual es \`h!\`.`
      );
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
