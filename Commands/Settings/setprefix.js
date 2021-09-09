const Command = require("../../Class/Command.js");
const SchemaPrefix = require("../../Database/Schema/CustomPrefix.js");

module.exports = class SetPrefix extends Command {
  constructor(client) {
    super(client, {
      name: "setprefix",
      aliases: ["newprefix"],
      description: "Establece un nuevo prefijo para el servidor.",
      usage: "setprefix <new-prefix>",
      example: "setprefix !!",
      category: "Settings",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: ["manageGuild"],
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
      const nuevo_prefix = args[0];
      const permissions = message.guild.permissionsOf(message.member.id);

      if (!permissions.has("manageGuild"))
        return message.channel.createMessage(
          `No cuentas con el permiso necesario para ejecutar el comando.\nPermiso necesario \`manageGuild\`.`
        );

      if (!nuevo_prefix)
        return message.channel.createMessage(
          `Debes ingresar el nuevo prefijo.`
        );

      if (nuevo_prefix.length > 3)
        return message.channel.createMessage(
          `El nuevo prefijo no puede superar los 3 caracteres.`
        );
      const findOnePrefix = await SchemaPrefix.findOne({
        guildID: message.guild.id,
      });

      const ServerPrefix = new SchemaPrefix({
        guildID: message.guild.id,
        prefix: nuevo_prefix,
      });

      findOnePrefix
        ? await SchemaPrefix.updateOne(
            { guildID: message.guild.id },
            { prefix: nuevo_prefix }
          )
        : await ServerPrefix.save();
      message.channel.createMessage(
        `El prefijo ha sido establecido exitosamente, mi nuevo prefijo en el servidor es \`${nuevo_prefix}\`.`
      );
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
