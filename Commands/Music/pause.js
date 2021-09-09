const Command = require("../../Class/Command.js");
const Eris = require("eris-pluris");

module.exports = class Pause extends Command {
  constructor(client) {
    super(client, {
      name: "pause",
      aliases: ["break"],
      description: "Pausa y reanuda la lista de canciones de un servidor.",
      usage: "pause",
      example: "pause",
      category: "Music",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: [],
      cooldown: 5,
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
      if (!player) {
        return message.channel.createMessage(
          `No hay ninguna canción que esté sonando actualmente en este servidor.`
        );
      }
      if (channel.channelID !== player.voiceChannel)
        return message.channel.createMessage(
          `Tienes que estar en mi canal de voz para usar este comando.`
        );

      if (!player.playing) {
        await player.pause(false);
        const embed_resume = new Eris.RichEmbed()
          .setColor(client.color)
          .setDescription(`La canción fue \`Reanudada\`.`);
        return message.channel.createMessage({ embed: embed_resume });
      }

      await player.pause(true);
      const embed_pause = new Eris.RichEmbed()
        .setColor(client.color)
        .setDescription(`La canción fue \`Pausada\`.`);
      message.channel.createMessage({ embed: embed_pause });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
