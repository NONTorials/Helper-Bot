const Command = require("../../Class/Command.js");
const Eris = require("eris-pluris");

module.exports = class Remove extends Command {
  constructor(client) {
    super(client, {
      name: "remove",
      aliases: ["rm"],
      description: "Elimina una canción de la lista.",
      usage: "remove <track-number>",
      example: "remove 4",
      category: "Music",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: [],
      cooldown: 5,
      nsfw: false,
      args: true,
      dev: false,
      enable: true,
    });
  }
  async run(message, args) {
    const client = this.client;
    try {
      const channel = message.member.voiceState;
      const player = await client.manager.players.get(message.guild.id);
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
      if (channel.channelID !== player.voiceChannel)
        return message.channel.createMessage(
          `Tienes que estar en mi canal de voz para usar este comando.`
        );
      if (!args[0]) {
        return message.channel.createMessage(
          `Debes ingresar el número de la canción que deseas remover.`
        );
      }
      if (isNaN(args[0])) {
        return message.channel.createMessage(
          `Debes ingresar únicamente números.`
        );
      }
      if (Number(args[0]) > player.queue.size)
        return message.channel.createMessage(
          `La canción debe estar en la cola, ejemplo \`${await client.guildPrefix(
            message
          )}remove ${
            player.queue.size - 2 <= 0
              ? player.queue.size
              : player.queue.size - 2
          }\``
        );

      await player.queue.remove(Number(args[0]) - 1);

      message.channel.createMessage(
        `He quitado la canción en la posición \`${Number(args[0])}\`.`
      );
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
