const Command = require("../../Class/Command.js");
const Eris = require("eris-pluris");

module.exports = class Shuffle extends Command {
  constructor(client) {
    super(client, {
      name: "shuffle",
      aliases: [],
      description: "Revuelve la lista de canciones.",
      usage: "shuffle",
      example: "shuffle",
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
      await player.set(
        "beforeshuffle",
        player.queue.map((track) => track)
      );

      await player.queue.shuffle();
      const embed_success = new Eris.RichEmbed()
        .setColor(client.color)
        .setDescription(`La lista de canciones ha sido revuelta.`);
      message.channel.createMessage({ embed: embed_success });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
