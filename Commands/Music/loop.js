const Command = require("../../Class/Command.js");
const Eris = require("eris-pluris");

module.exports = class Loop extends Command {
  constructor(client) {
    super(client, {
      name: "loop",
      aliases: [],
      description:
        "Activa el loop, ya sea en la song o en la queue o en dado caso, la desactiva.",
      usage: "loop <song | queue | off>",
      example: "loop song",
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
      if (channel.channelID !== player.voiceChannel) {
        return message.channel.createMessage(
          `Tienes que estar en mi canal de voz para usar este comando.`
        );
      }
      if (!args[0]) {
        return message.channel.createMessage(
          `Debes ingresar que tipo de loop quieres. \`${await client.guildPrefix(
            message
          )}loop <song | queue | off>\`.`
        );
      }
      if (
        args[0].toLowerCase() === `song` ||
        args[0].toLowerCase() === `track` ||
        args[0].toLowerCase() === `s` ||
        args[0].toLowerCase() === `t`
      ) {
        if (player.trackRepeat) {
          await player.setTrackRepeat(false);
        } else {
          await player.setTrackRepeat(true);
        }
        if (player.queueRepeat) {
          await player.setQueueRepeat(false);
        }
        const embed = new Eris.RichEmbed()
          .setColor(client.color)
          .setDescription(
            `El modo de repetición de la canción ahora está \`${
              player.trackRepeat ? `Habilitado` : `Deshabilitado`
            }\`.`
          );
        return message.channel.createMessage({ embed: embed });
      } else if (
        args[0].toLowerCase() === `queue` ||
        args[0].toLowerCase() === `qu` ||
        args[0].toLowerCase() === `q`
      ) {
        if (player.queueRepeat) {
          await player.setQueueRepeat(false);
        } else {
          await player.setQueueRepeat(true);
        }
        if (player.trackRepeat) {
          await player.setTrackRepeat(false);
        }

        const embed = new Eris.RichEmbed()
          .setColor(client.color)
          .setDescription(
            `El modo de repetición de la lista de canciones ahora está \`${
              player.queueRepeat ? `Habilitado` : `Deshabilitado`
            }\`.`
          );
        return message.channel.createMessage({ embed: embed });
      } else if (args[0].toLowerCase() === "off") {
        if (player.queueRepeat) {
          await player.setQueueRepeat(false);
        }
        if (player.trackRepeat) {
          await player.setTrackRepeat(false);
        }
        const embed = new Eris.RichEmbed()
          .setColor(client.color)
          .setDescription(
            `El modo de repetición de la lista de canciones y de la canción ahora están \`Deshabilitadas\`.`
          );
        return message.channel.createMessage({ embed: embed });
      }
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
