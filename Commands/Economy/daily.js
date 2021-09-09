const Command = require("../../Class/Command.js");

module.exports = class Daily extends Command {
  constructor(client) {
    super(client, {
      name: "daily",
      aliases: ["d"],
      description: "Te da cierta cantidad de dinero por día.",
      usage: "daily",
      example: "daily",
      category: "Economy",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: [],
      cooldown: 60 * 60 * 24,
      nsfw: false,
      args: false,
      dev: false,
      enable: true,
    });
  }
  async run(message, args) {
    const client = this.client;
    try {
      const dinero_ganado = Math.floor(Math.random() * 150);
      await message.channel.createMessage(
        `Has recibido :coin: **${dinero_ganado}** coin's.`
      );
      await client.addMoney(message.author, dinero_ganado);
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
