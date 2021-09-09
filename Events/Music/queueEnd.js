const Eris = require("eris-pluris");

module.exports = class QueueEnd {
  constructor(client) {
    this.client = client;
  }
  async run(player, track) {
    const client = this.client;
    const channel = client.getChannel(player.textChannel);
    const msg = await channel.getMessage(player.lastMessage).catch(() => {}) || false;
    if (msg) await msg.delete().catch(() => {});
    const embed_finish = new Eris.RichEmbed()
      .setColor(client.color)
      .setDescription(`Lista de canciones vacía, dejando el canal de voz.`);
    client
      .getChannel(player.textChannel)
      .createMessage({ embed: embed_finish });
    player.destroy();
  }
};
