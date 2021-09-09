const Command = require("../../Class/Command.js");
const { RichEmbed } = require("eris-pluris");
const { getInfo } = require("ytdl-core");
const { format } = require("../../Functions/Format.js");

module.exports = class NowPlaying extends Command {
  constructor(client) {
    super(client, {
      name: "nowplaying",
      aliases: ["np", "current"],
      description: "Muestra información sobre la canción actual",
      usage: "nowplaying",
      example: "nowplaying",
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
      const player = client.manager.players.get(message.guild.id);
      if (!player)
        return message.channel.createMessage(
          `No hay ninguna canción que se esté reproduciendo en este servidor.`
        );
      const data = await getInfo(player.queue.current.uri);
      const array = [
        `Duración: \`${
          player.queue.current.isStream
            ? `🔴 Live Stream`
            : format(player.queue.current.duration)
        }\`.`,
        `Autor: \`${data.videoDetails.author.name}\`.`,
        `Añadida por: \`${
          player.queue.current.requester.username +
          "#" +
          player.queue.current.requester.discriminator
        }\`.`,
        `Fecha de publicación: \`${data.videoDetails.publishDate}\`.`,
        `Likes: \`${data.videoDetails.likes.toLocaleString()}\`.`,
        `Dislikes: \`${
          data.videoDetails.dislikes
            ? data.videoDetails.dislikes.toLocaleString()
            : data.videoDetails.dislikes
        }\`.`,
        `Vistas: \`${parseInt(
          data.videoDetails.viewCount
        ).toLocaleString()}\`.`,
      ];
      const embedNowPlaying = new RichEmbed()
        .setAuthor(
          message.author.username,
          undefined,
          message.author.dynamicAvatarURL()
        )
        .setThumbnail(data.videoDetails.thumbnails[0].url)
        .setURL(data.videoDetails.video_url)
        .setColor(client.color)
        .setTitle(data.videoDetails.title)
        .setDescription(array.join("\n"))
        .setFooter(`Total de canciones en la lista: ${player.queue.length}`)
        .addField(
          `**Barra de progreso:**`,
          `${createProgressBar(
            player.position,
            player.queue.current.duration,
            12
          )}\n\`${
            new Date(player.position).toISOString().substr(11, 8) +
            " / " +
            (player.queue.current.duration == 0
              ? " 🔴 Live Stream"
              : new Date(player.queue.current.duration)
                  .toISOString()
                  .substr(11, 8))
          }\``
        );
      client.createMessage(message.channel.id, { embed: embedNowPlaying });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(error.stack, "js")
      );
    }
  }
};

function createProgressBar(current, total, max) {
  const percentage = current / total;
  const percentageText = Math.round(percentage * 100);
  const progress = Math.round(max * (current / total));
  const remain = max - progress;
  return `**[${[
    "▬".repeat(progress),
    "<a:cdmusic:884176165445726208>",
    "▬".repeat(remain),
  ].join("")}]** ${percentageText}%`;
}
