const { removeMarkdown } = require('../../Functions/String');
const { RichEmbed } = require("eris-pluris");

module.exports = class TrackStart {
  constructor(client) {
    this.client = client;
  }
  async run(player) {
    const client = this.client;
    const channel = client.getChannel(player.textChannel);
    const msg = await channel.getMessage(player.lastMessage).catch(() => {}) || false;
    if (msg) await msg.delete().catch(() => {});
  }
};
