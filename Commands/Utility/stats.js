const Command = require("../../Class/Command.js");
const { VERSION, RichEmbed } = require("eris-pluris");
const { usagePercent } = require("cpu-stat");
const { platform, cpus } = require("os");

module.exports = class Stats extends Command {
  constructor(client) {
    super(client, {
      name: "stats",
      aliases: ["botinfo"],
      description: "Muestra información relevantes acerca del bot.",
      usage: "stats",
      example: "stats",
      category: "Utility",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: [],
      cooldown: 4,
      nsfw: false,
      args: false,
      dev: false,
      enable: true,
    });
  }
  async run(message, args) {
    const client = this.client;
    try {
      const usage = require("util").promisify(usagePercent);
      const porcentaje = await usage();
      const sistema = [
        `Plataforma: \`${platform()[0].toUpperCase()}${platform().slice(1)}\`.`,
        `Tiempo encendido: \`${require("@fabricio-191/ms")(client.uptime, {
          language: "es",
          long: true,
        })}\`.`,
        `Memoria usada: \`${(
          process.memoryUsage().heapUsed /
          1024 /
          1024
        ).toFixed(2)}mb\`.`,
        `Modelo de CPU: \`${cpus()[0].model}\`.`,
        `CPU Usada: \`${porcentaje.toFixed(2)}%\`.`,
      ];

      const general = [
        `Username: \`${
          client.user.username + "#" + client.user.discriminator
        }\`.`,
        `Desarrolladores: \`${client.devs
          .map((uwu) => client.users.get(uwu))
          .map((xd) => xd.username + "#" + xd.discriminator)
          .join(", ")}\`.`,
        `Número de comandos: \`${client.commands.size}\`.`,
        `Número de servidores: \`${client.guilds.size}\`.`,
        `Conexiones a voz: \`${client.manager.players.size}\`.`,
        `Lenguaje: \`JavaScript\`.`,
        `Librería principal: \`Eris ${VERSION}\`.`,
      ];

      const embed_success = new RichEmbed()
        .setColor(client.color)
        .setThumbnail(client.user.dynamicAvatarURL("png", 1024))
        .addField("**General:**", general.join("\n"))
        .addField("**Sistema:**", sistema.join("\n"));
      message.channel.createMessage({ embed: embed_success });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
