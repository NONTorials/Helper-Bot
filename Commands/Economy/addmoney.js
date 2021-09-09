const Command = require("../../Class/Command.js");

module.exports = class AddMoney extends Command {
  constructor(client) {
    super(client, {
      name: "addmoney",
      aliases: ["add"],
      description: "Añade cierta cantidad de dinero a una persona.",
      usage: "addmoney <user-mention>",
      example: "addmoney",
      category: "Economy",
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
      const mencionado = message.mentions[0];
      const permissions = message.guild.permissionsOf(message.member.id);

      if (!permissions.has("manageGuild"))
        return message.channel.createMessage(
          `No cuentas con el permiso necesario para ejecutar el comando.\nPermiso necesario \`manageGuild\`.`
        );

      if (!mencionado)
        return message.channel.createMessage(`Debes mencionar a una persona.`);

      if (mencionado.bot)
        return message.channel.createMessage(
          `Debes mencionar únicamente a personas reales, no bot\'s.`
        );

      if (!isNaN(args.slice(1).join("")))
        return message.channel.createMessage(
          `Debes ingresar únicamente números.`
        );

      if (args.slice(1).join("") > 1000)
        return message.channel.createMessage(
          `No puedes dar más de 1000 coins por comando.`
        );

      await this.client.addMoney(mencionado, parseInt(args.slice(1).join("")));
      message.channel.createMessage(`Cantidad añadida correctamente.`);
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
