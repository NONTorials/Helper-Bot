const Command = require("../../Class/Command.js");
const { Message } = require("eris-pluris");

module.exports = class ForceSkip extends Command {
  constructor(client) {
    super(client, {
      name: "forceskip",
      aliases: ["fs"],
      description: "Salta una canción de manera inmediata.",
      usage: "forceskip",
      example: "forceskip",
      category: "Music",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: ["voicePrioritySpeaker"],
      cooldown: 3,
      nsfw: false,
      args: false,
      dev: false,
      enable: true,
    });
  }
  /**
   *
   * @param {Message} message
   */
  async run(message, args) {
    const client = this.client;
    try {
      if (!message.member.voiceState.channelID)
        return message.channel.createMessage({
          content: "Necesitas estar en un canal de voz.",
        });

      if (
        !message.member.permissions.has("voicePrioritySpeaker") &&
        !client.devs.includes(message.member.user.id)
      )
        return message.channel.createMessage(
          `No tienes el permiso necesario para usar ese comando.\nPermiso necesario \`${_humanizePerm(
            "voicePrioritySpeaker"
          )}\`.`
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

      await player.stop();
      message.channel.createMessage({
        content: "La canción ha sido saltada con éxito.",
      });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};

function _humanizePerm(perm) {
  perm = perm.replace(/[A-Z]/g, (x) => ` ${x}`);
  if (perm.split(" ").join("").includes("VAD"))
    perm = perm.replace(new RegExp("V A D", "i"), "Voice Activity Detection");
  perm = perm.replace(/Voice /i, "");
  if (perm.split(" ").join("").includes("TTS"))
    perm = perm.replace(new RegExp("T T S", "i"), "Text-To-Speech");
  perm = perm[0].toUpperCase() + perm.slice(1).toLowerCase();

  return perm;
}
