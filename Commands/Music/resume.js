const Command = require("../../Class/Command.js");
const Eris = require("eris-pluris");

module.exports = class Resume extends Command {
  constructor(client) {
    super(client, {
      name: "resume",
      aliases: [],
      description: "Vuelve a comenzar a reproducir la música antes pausada.",
      usage: "resume",
      example: "resume",
      category: "Music",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: [],
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
      if (!player.paused)
        return message.channel.createMessage(
          `La lista de canciones no está pausada.`
        );

      await player.pause(false);
      const embed_success = new Eris.RichEmbed()
        .setColor(client.color)
        .setDescription(`He vuelto a empezar a reproducir la música para ti.`);
      return message.channel.createMessage({ embed: embed_success });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
