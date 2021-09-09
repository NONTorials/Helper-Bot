const Command = require("../../Class/Command.js");

module.exports = class Volume extends Command {
  constructor(client) {
    super(client, {
      name: "volume",
      aliases: ["vl", "v"],
      description: "Cambia el volumen de las canciones.",
      usage: "volume <number>",
      example: "volume 75",
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
      if (channel.channelID !== player.voiceChannel)
        return message.channel.createMessage(
          `Tienes que estar en mi canal de voz para usar este comando.`
        );
      if (!args[0])
        return message.channel.createMessage(
          `Volumen actual \`${player.volume}%\`.`
        );
      if (Number(args) <= 0 || Number(args) > 100)
        return message.channel.createMessage(
          `Únicamente puede ajustar el volumen del 1 al 100.`
        );

      await player.setVolume(Number(args));

      return message.channel.createMessage(
        `Volumen cambiado a \`${player.volume}%\`.`
      );
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
