const Command = require("../../Class/Command.js");
const Eris = require("eris-pluris");

module.exports = class Reload extends Command {
  constructor(client) {
    super(client, {
      name: "reload",
      aliases: ["re"],
      description: "Borra y pone la versión más actual del comando",
      usage: "reload <category> <cmd>",
      example: "reload Music play",
      category: "Developers",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: [],
      cooldown: 0,
      nsfw: false,
      args: true,
      dev: true,
      enable: true,
    });
  }
  async run(message, args) {
    const client = this.client;
    try {
      if (!client.devs.includes(message.author.id)) return;

      const folderName = args[0];
      if (!folderName)
        return message.channel.createMessage(`Ingresa una categoría.`);
      const category = client.commands.filter((x) =>
        x.information.category.includes(folderName)
      );
      if (!category)
        return message.channel.createMessage(`La categoría dada no existe.`);

      if (!args.slice(1).join(" "))
        return message.channel.createMessage(`Ingresa un comando.`);
      const cmd = client.commands.get(args.slice(1).join(" "));
      if (!cmd)
        return message.channel.createMessage(`Ingresa un comando válido.`);
      client.commands.delete(cmd.information.name);
      delete require.cache[
        require.resolve(
          `../../Commands/${args[0]}/${args.slice(1).join(" ")}.js`
        )
      ];
      const pull = require(`../../Commands/${args[0]}/${args
        .slice(1)
        .join(" ")}.js`);
      client.commands.set(args.slice(1).join(" "), new pull(client));
      const embed = new Eris.RichEmbed()
        .setAuthor(
          message.author.username,
          undefined,
          message.author.dynamicAvatarURL()
        )
        .setColor(client.color)
        .setDescription(
          `El comando \`${args
            .slice(1)
            .join(" ")}\` ha sido recargado correctamente.`
        );
      message.channel.createMessage({ embed: embed });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
