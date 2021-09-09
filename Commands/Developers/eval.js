const Command = require("../../Class/Command.js");
const Util = require("util");
const Eris = require("eris-pluris");
const { token, cookie } = require("../../config.js");

module.exports = class Eval extends Command {
  constructor(client) {
    super(client, {
      name: "eval",
      aliases: ["e", "ev"],
      description: "Evalúa un código desde el bot",
      usage: "eval <code>",
      example: "eval message",
      category: "Developers",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: [],
      cooldown: 0,
      nsfw: false,
      args: true,
      dev: true,
      enable: true,
    });
  }
  async run(message, args) {
    const client = this.client;
    if (!client.devs.includes(message.author.id)) return;
    if (!args[0])
      return client.createMessage(
        message.channel.id,
        `Debes ingresar algo para evaluar.`
      );
    try {
      let output = await eval(args.join(" "));
      let información = [
        `Class: \`${output?.constructor?.name || "No encontrada"}\`.`,
        `Tipo: \`${client.touppercase(typeof output)[0] || "No encontrada"}\`.`,
      ];
      if (typeof output !== "string")
        output = Util.inspect(output, { depth: 0 });
      if (output.length >= 2010) output = `${output.substr(0, 2000)}...`;
      const embed_eval = new Eris.RichEmbed()
        .setAuthor(
          message.author.username,
          undefined,
          message.author.dynamicAvatarURL()
        )
        .setDescription(
          client.markdown(
            replace(output, [
              global.cookie,
              global.token,
              token,
              cookie,
              "mongodb+srv://DevEater:Byfabrox1997@discordbotineris.ejunk.mongodb.net/HelperBotDatabase?retryWrites=true&w=majority",
            ]),
            "js"
          )
        )
        .addField("Información:", información.join("\n"))
        .setColor(client.color);
      await client.createMessage(message.channel.id, { embed: embed_eval });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};

function replace(string, array) {
  let res = string;

  for (const i of array) {
    res = res.split(i).join("Código no disponible");
  }

  return res;
}
