const cooldown = require("../../Functions/Cooldown.js");

module.exports = class MessageCreate {
  constructor(client) {
    this.client = client;
  }
  async run(message) {
    const client = this.client;
    if (message.channel.type === "dm") return;
    if (!message.guild) return;
    if (message.author.bot) return;
    const prefix = await client.guildPrefix(message);
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd =
      client.commands.get(command) ||
      client.commands.find((c) => c.information.aliases.includes(command));
    if (!cmd) return;

    if (!cooldown(message, cmd, args)) return;
  }
};
