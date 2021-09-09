const Command = require("../../Class/Command.js");
const Eris = require("eris-pluris");

module.exports = class Unshuffle extends Command {
  constructor(client) {
    super(client, {
      name: "unshuffle",
      aliases: [],
      description: "La lista de canciones fue reorganizada.",
      usage: "unshuffle",
      example: "unshuffle",
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

      if (!player.get("beforeshuffle"))
        return message.channel.createMessage(
          `La lista de canciones no ha sido revuelta anteriormente.`
        );
      await player.queue.clear();

      for (const track of player.get("beforeshuffle")) {
        player.queue.add(track);
      }
      const embed_succes = new Eris.RichEmbed()
        .setColor(client.color)
        .setDescription(`La lista de canciones ha sido reorganizada.`);
      message.channel.createMessage({ embed: embed_succes });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
