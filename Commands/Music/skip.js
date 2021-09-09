const Command = require("../../Class/Command.js");
const Eris = require("eris-pluris");

module.exports = class Skip extends Command {
  constructor(client) {
    super(client, {
      name: "skip",
      aliases: ["s"],
      description: "Salta una canción de la lista de reproducción.",
      usage: "skip",
      example: "skip",
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
      if (!message.guild.channels.get(message.member.voiceState.channelID))
        return client.createMessage(
          message.channel.id,
          `Debes estar en un canal de voz para usar este comando.`
        );

      const channel = message.member.voiceState;
      const player = client.manager.players.get(message.guild.id);
      if (!player)
        return message.channel.createMessage(
          `No hay ninguna canción que se esté reproduciendo en este servidor.`
        );
      if (channel.channelID !== player.voiceChannel)
        return message.channel.createMessage(
          `Tienes que estar en mi canal de voz para usar este comando.`
        );
      if (
        message.guild.channels
          .get(message.member.voiceState.channelID)
          .voiceMembers.filter((x) => !x.user.bot).length === 1
      ) {
        const embed_only_member = new Eris.RichEmbed()
          .setColor(client.color)
          .setDescription(`La canción actual fue saltada.`);
        message.channel.createMessage({ embed: embed_only_member });
        await player.stop();
        return;
      }
      const map = client.skipvote;
      const mapload = map.get(message.guild.id);

      if (mapload) {
        if (mapload.users.includes(message.author.id))
          return message.channel.createMessage({
            content: `\`${message.author.username}\` ya has votado.`,
          });
        await mapload.users.push(message.author.id);

        if (mapload.users.length > 1) {
          let skipNumber =
            /*1 +*/
            parseInt(
              message.guild.channels
                .get(message.member.voiceState.channelID)
                .voiceMembers.filter((x) => !x.user.bot).length /* / 2 */
            );
          const embed_vote = new Eris.RichEmbed()
            .setColor(client.color)
            .setDescription(
              `\`${message.author.username}\` ha votado para saltar la canción. \`(${mapload.users.length}/${skipNumber})\``
            );
          message.channel.createMessage({
            embed: embed_vote,
          });
        }

        const number = parseInt(
          message.guild.channels
            .get(message.member.voiceState.channelID)
            .voiceMembers.filter((x) => !x.user.bot).length /* / 2 */
        );

        if (mapload.users.length < number /* + 1 */) return;
        const embed_success = new Eris.RichEmbed()
          .setColor(client.color)
          .setDescription(`La canción actual fue saltada.`);
        message.channel.createMessage({
          embed: embed_success,
        });

        await player.stop();
        await client.skipvote.delete(message.guild.id);
      } else {
        const listUser = {
          users: [],
        };
        await map.set(message.guild.id, listUser);
        await listUser.users.push(message.author.id);

        let skipNumber = parseInt(
          message.guild.channels
            .get(message.member.voiceState.channelID)
            .voiceMembers.filter((x) => !x.user.bot).length /* / 2 */
        );

        const embed_init = new Eris.RichEmbed()
          .setColor(client.color)
          .setDescription(
            `\`${
              message.author.username
            }\` ha iniciado una votación para saltar la canción. \`(1/${
              skipNumber /* + 1 */
            })\`.`
          );
        return message.channel.createMessage({
          embed: embed_init,
        });
      }
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.stack}`, "js")
      );
    }
  }
};

// if (!message.guild.channels.get(message.member.voiceState.channelID))
//   return client.createMessageReply(
//     message,
//     `Debes estar en un canal de voz para usar este comando.`
//   );

// const channel = message.member.voiceState;
// const player = client.manager.players.get(message.guild.id);
// if (!player)
//   return message.channel.createMessage(
//     `No hay ninguna canción que se esté reproduciendo en este servidor.`
//   );
// if (channel.channelID !== player.voiceChannel)
//   return message.channel.createMessage(
//     `Tienes que estar en mi canal de voz para usar este comando.`
//   );
// player.stop();
// message.channel.createMessage(
//   "Pasamos a la siguiente canción."
// );
