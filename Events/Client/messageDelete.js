module.exports = class MessageDelete {
  constructor(client) {
    this.client = client;
  }
  async run(message) {
    if (!message.author) return;
    if (message.author.bot) return;
    if (!message.channel.type === "dm") return;
    const guildSnipes =
      (await this.client.snipes.get(message.channel.id)) || [];

    guildSnipes.unshift({
      date: Date.now(),
      author: message.author,
      content: message.content,
      message_id: message.id,
      attachments: message.attachments,
      attachment_url: message.attachments[0]
        ? message.attachments[0].proxy_url
        : null,
      attachment_name: message.attachments[0]
        ? message.attachments[0].filename
        : null,
      attachment_size: message.attachments[0]
        ? (message.attachments[0].size / 1024).toFixed(2)
        : null,
    });

    guildSnipes.splice(10);
    this.client.snipes.set(message.channel.id, guildSnipes);
  }
};
