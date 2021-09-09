const Command = require("../../Class/Command.js");
const Eris = require("eris-pluris");

module.exports = class Stop extends Command {
  constructor(client) {
    super(client, {
      name: "stop",
      aliases: ["leave", "dis", "disconnect"],
      description: "Detiene la lista de canciones de un servidor.",
      usage: "stop",
      example: "stop",
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
      await player.destroy();

      let texto;
      const link_con_permisos_8 = `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`;      
      let array = [
        `Si te gustó mi servicio, considera [invitarme](${link_con_permisos_8})!`,
        ""
      ]
      texto = Math.floor(Math.random() * array.length);

      const embed_succes = new Eris.RichEmbed()
        .setColor(client.color)
        .setDescription(
          `La lista de canciones fue detenida y eliminada.\n${array[texto]}`
        );
      message.channel.createMessage({ embed: embed_succes });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
