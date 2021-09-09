module.exports = class PlayerMove {
  constructor(client) {
    this.client = client;
  }
  async run(player, currentChannel, newChannel) {
    const client = this.client;
    if (!newChannel) {
      client
        .getChannel(player.textChannel)
        .createMessage(`Desconectado exitosamente.`)
        .catch(() => {});
      return await player.destroy();
    }
    player.voiceChannel = newChannel;
    await player.pause(true);
    setTimeout(async () => {
      await player.pause(false);
    }, 3000);
  }
};
