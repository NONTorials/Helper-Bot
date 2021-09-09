const Command = require("../../Class/Command.js");
const Eris = require("eris-pluris");

module.exports = class Jump extends Command {
  constructor(client) {
    super(client, {
      name: "jump",
      aliases: [],
      description: "Salta a una canción específica.",
      usage: "jump <track-number>",
      example: "jump 4",
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
          `Debes ingresar el número de la canción a la deseas saltar.`
        );
      }
      if (isNaN(args[0])) {
        return message.channel.createMessage(
          `Debes ingresar únicamente números.`
        );
      }
      if (Number(args[0]) > player.queue.size)
        return message.channel.createMessage(
          `La canción debe estar en la cola, ejemplo: \`${await client.guildPrefix(
            message
          )}jump ${
            player.queue.size - 2 <= 0
              ? player.queue.size
              : player.queue.size - 2
          }\`.`
        );

      await player.queue.remove(0, Number(args[0]) - 1);
      await player.stop();

      const embed_success = new Eris.RichEmbed()
        .setColor(client.color)
        .setDescription(
          `He saltado hasta la canción número \`${Number(args[0])}\`.`
        );
      message.channel.createMessage({ embed: embed_success });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
