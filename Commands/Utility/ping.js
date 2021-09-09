const Command = require("../../Class/Command.js");
const Eris = require("eris-pluris");
const mongoose = require("mongoose");

module.exports = class Ping extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      aliases: ["pong"],
      description: "Da el ping del bot",
      usage: "ping",
      example: "ping",
      category: "Utility",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: [],
      cooldown: 4,
      nsfw: false,
      args: false,
      dev: false,
      enable: true,
    });
  }
  async run(message, args) {
    const client = this.client;
    try {
      const date = Date.now();
      const pingDB = new Promise((r) =>
        mongoose.connection.db.admin().ping((_, result) => r(Date.now() - date))
      );
      const description = [
        `Bot Ping: \`${message.channel.guild.shard.latency}ms\`.`,
        `API Ping: \`${Date.now() - message.timestamp}ms\`.`,
        `DataBase Ping: \`${await pingDB}ms\`.`,
      ];
      const embed = new Eris.RichEmbed()
        .setDescription(description.join("\n"))
        .setColor(client.color);
      client.createMessage(message.channel.id, { embed: embed });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
