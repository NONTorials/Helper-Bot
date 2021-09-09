const Command = require("../../Class/Command.js");
const Eris = require("eris-pluris");

module.exports = class Balance extends Command {
  constructor(client) {
    super(client, {
      name: "balance",
      aliases: ["bal"],
      description: "Muestra el saldo actual de la persona mencionada.",
      usage: "balance (user-mention)",
      example: "balance",
      category: "Economy",
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
      const mencionado = message.mentions[0] || message.author;
      const Schema = require("../../Database/Schema/Economy.js");
      Schema.findOne({ userID: mencionado.id }, async (err, data) => {
        if (err) throw err;
        if (!data)
          return message.channel.createMessage(`Este usuario no tiene dinero.`);
        if (data) {
          const embed_success = new Eris.RichEmbed()
            .setColor(client.color)
            .setAuthor(
              `${mencionado.username}#${mencionado.discriminator}`,
              undefined,
              mencionado.dynamicAvatarURL()
            )
            .addField("**Banco:**", `:coin: ${data.money}`, true)
            .addField("**Total:**", `:coin: ${data.money}`, true);
          return message.channel.createMessage({ embed: embed_success });
        }
      });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
