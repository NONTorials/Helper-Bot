const Eris = require("eris-pluris");

module.exports = class VoiceStateUpdate {
  constructor(client) {
    this.client = client;
  }
  async run(member, oldState) {
    const client = this.client;
    let player = client.manager.players.get(member.guild.id);
    if (!player) return;
    if (
      member.id === client.user.id &&
      oldState.selfDeaf === true &&
      member.guild.channels
        .get(player.voiceChannel)
        .voiceMembers.get(client.user.id).voiceState.selfDeaf === false
    ) {
      await player.pause(true);
    } else {
      await player.pause(false);
    }
    if (
      player &&
      member.guild.channels
        .get(player.voiceChannel)
        .voiceMembers.filter((x) => !x.user.bot).length === 0
    ) {
      setTimeout(async () => {
        try {
          player = client.manager.players.get(member.guild.id);
          if (
            !member.guild.channels
              .get(player.voiceChannel)
              .voiceMembers.has(client.user.id) &&
            player
          ) {
            return await player.destroy();
          }
          var vc = member.guild.channels.get(player.voiceChannel);
          if (
            player &&
            vc &&
            member.guild.channels
              .get(player.voiceChannel)
              .voiceMembers.filter((x) => !x.user.bot).length === 0
          ) {
            const embed = new Eris.RichEmbed()
              .setColor(client.color)
              .setDescription(
                `Debido a que el canal de voz esta vacío, he eliminado la cola y me he salido del canal de voz.`
              );
            member.guild.channels
              .get(player.textChannel)
              .createMessage({ embed: embed });
            await player.destroy();
          }
        } catch (e) {
          console.log(e);
        }
      }, 20000);
    }
  }
};
