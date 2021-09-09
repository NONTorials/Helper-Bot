const Command = require("../../Class/Command.js");
const { format } = require("../../Functions/Format.js");

module.exports = class Seek extends Command {
  constructor(client) {
    super(client, {
      name: "seek",
      aliases: [],
      description: "Cambia la posición de la Canción",
      usage: "seek <seconds>",
      example: "seek 40",
      category: "Music",
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
      const player = client.manager.players.get(message.guild.id);
      const voiceChannel = message.guild.channels.get(
        message.member.voiceState.channelID
      );
      if (!voiceChannel) {
        return client.createMessage(message.channel.id, {
          content: `Necesitas estar en un canal de voz.`,
        });
      }
      if (!player)
        return message.channel.createMessage(
          `No hay ninguna canción que se esté reproduciendo en este servidor.`
        );
      if (!player.queue.current)
        return message.channel.createMessage(
          `No hay ninguna canción que se esté reproduciendo en este servidor.`
        );
      if (message.member.voiceState.channelID !== player.voiceChannel)
        return message.channel.createMessage(
          `Tienes que estar en mi canal de voz para usar este comando.`
        );
      if (!args[0])
        return message.channel.createMessage(
          "Debes ingresar el segundo al que deseas saltar."
        );
      if (
        Number(args[0]) < 0 ||
        Number(args[0]) >= player.queue.current.duration / 1000
      )
        return message.channel.createMessage(
          `Puede buscar desde \`0\` hasta los \`${
            player.queue.current.duration / 1000
          }\` segundos.`
        );
      await player.seek(Number(args[0]) * 1000);

      message.channel.createMessage(
        `La posición de la canción fue cambiada. \`${format(
          Number(args[0]) * 1000
        )}\`.`
      );
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
