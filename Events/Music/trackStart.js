const { removeMarkdown } = require('../../Functions/String');
const { RichEmbed } = require("eris-pluris");

module.exports = class TrackStart {
  constructor(client) {
    this.client = client;
  }
  async run(player, track) {
    const client = this.client;
    const channel = client.getChannel(player.textChannel);
    const embed_playing = new RichEmbed()
      .setDescription(
        `Reproduciendo __**[${removeMarkdown(track.title)}](${track.uri})**__ pedida por <@!${track.requester.id}> (**${
          client.users.get(track.requester.id).username
        }#${client.users.get(track.requester.id).discriminator}**).`
      )
      .setColor(client.color);
    const lastMessage = await channel
      .createMessage({ embed: embed_playing })
      .catch(() =>
        console.log(
          "❌ | No pude enviar el mensaje de inicio de la canción."
        ));
    player.lastMessage = lastMessage?.id;
  }
};
