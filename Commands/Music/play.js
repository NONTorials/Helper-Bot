const Command = require("../../Class/Command.js");
const { RichEmbed } = require("eris-pluris");
const {
  CheckVoicePermission,
} = require("../../Functions/CheckVoicePermission.js");

module.exports = class Play extends Command {
  constructor(client) {
    super(client, {
      name: "play",
      aliases: ["p"],
      description:
        "Reproduce música de diferentes plataformas de reproducción de música.",
      usage: "play <song | url>",
      example: "play No lie",
      category: "Music",
      PermissionsBot: [
        "viewChannel",
        "sendMessages",
        "embedLinks",
        "voiceConnect",
        "voiceSpeak",
      ],
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
      const voiceChannel = message.guild.channels.get(
        message.member.voiceState.channelID
      );

      if (!voiceChannel) {
        return client.createMessage(message.channel.id, {
          content: `Necesitas estar en un canal de voz.`,
        });
      }

      if (!args.join(" "))
        return message.channel.createMessage(
          `Debes ingresar el título o URL de la canción a reproducir.`
        );

      const res = await client.manager.search(args.join(" "), message.author);
      const player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voiceState.channelID,
        textChannel: message.channel.id,
        selfDeafen: true,
      });

      const channel = message.member.voiceState;
      if (channel.channelID !== player.voiceChannel)
        return message.channel.createMessage(
          `Tienes que estar en mi canal de voz para usar este comando.`
        );

      if (!CheckVoicePermission(client, message, "viewChannel"))
        return message.channel.createMessage(
          `No tengo el permiso necesario para unirme al canal de voz.\nPermiso necesario \`viewChannel\`.`
        );

      if (!CheckVoicePermission(client, message, "voiceConnect"))
        return message.channel.createMessage(
          `No tengo el permiso necesario para unirme al canal de voz.\nPermiso necesario \`voiceConnect\`.`
        );

      if (!CheckVoicePermission(client, message, "voiceSpeak"))
        return message.channel.createMessage(
          `No tengo el permiso necesario para unirme al canal de voz.\nPermiso necesario \`voiceSpeak\`.`
        );

      if (player.state !== "CONNECTED") {
        await player.connect();
        const embed_join = new RichEmbed()
          .setTitle("Reproducción de música")
          .setColor(client.color)
          .setDescription(
            `Entrando al canal de voz \`${
              message.guild.channels.get(message.member.voiceState.channelID)
                .name
            }\`.`
          );
        message.channel.createMessage({ embed: embed_join });
      }
      const getPlayer = client.manager.players.get(message.guild.id);
      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy();
        message.channel.createMessage(
          `Ocurrió un error inesperado, intenta nuevamente.`
        );
        throw res.exception;
      } else if (res.loadType === "NO_MATCHES") {
        if (!player.queue.current) player.destroy();
        message.channel.createMessage(
          `Lastimosamente no he encontrado la canción que deseas, intenta nuevamente.`
        );
      } else if (res.loadType === "TRACK_LOADED") {
        player.queue.add(res.tracks[0]);
        if (getPlayer.queue[0]) {
          const embed_track_loaded = new RichEmbed()
            .setTitle("Lista de reproducción")
            .setColor(client.color)
            .setDescription(
              `Se agregó __**${
                res.tracks[0].uri
                  ? `[${res.tracks[0].title}](${res.tracks[0].uri})`
                  : res.tracks[0].title
              }**__ a la lista`
            );
          message.channel.createMessage({ embed: embed_track_loaded });
        }

        if (!player.playing) player.play();
      } else if (res.loadType === "PLAYLIST_LOADED") {
        client.manager.emit("playListAdd", res.playlist);
        res.tracks.forEach((track) => player.queue.add(track));
        const embed_playlist_loaded = new RichEmbed()
          .setTitle("Lista de reproducción")
          .setColor(client.color)
          .setDescription(
            `Se añadieron \`${res.tracks.length}\` canciones a la lista de reproducción desde la playlist \`${res.playlist.name}\`.`
          );
        for (const song of player.queue) {
          song.resolve?.();
        }
        message.channel.createMessage({ embed: embed_playlist_loaded });

        if (!player.playing) await player.play();
      } else if (res.loadType === "SEARCH_RESULT") {
        const tracks = res.tracks.slice(0, 10);
        const track = tracks[0];
        player.queue.add(track);
        if (getPlayer.queue[0]) {
          const embed_song_added = new RichEmbed()
            .setTitle("Lista de reproducción")
            .setColor(client.color)
            .setDescription(
              `Se agregó __**[${track.title}](${track.uri})**__ a la lista.`
            );
          message.channel.createMessage({ embed: embed_song_added });
        }

        if (!player.playing) await player.play();
      }
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
