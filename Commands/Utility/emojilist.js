const { SwapPages } = require("../../Functions/SwapPages.js");
const Command = require("../../Class/Command.js");
const { RichEmbed } = require("eris-pluris");

module.exports = class EmojiList extends Command {
  constructor(client) {
    super(client, {
      name: "emojilist",
      aliases: ["emojis"],
      description: "Muestra la lista de emojis del servidor.",
      usage: "emojilist",
      example: "emojilist",
      category: "Utility",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: [],
      cooldown: 5,
      nsfw: false,
      args: false,
      dev: false,
      enable: true,
    });
  }
  async run(message, args) {
    const client = this.client;
    try {
      const unavailable = message.guild.emojis.filter(
        (e) => !e.available
      ).length;
      if (!message.guild.emojis.length) {
        return message.channel.createMessage(`No hay emojis en el servidor.`);
      }

      if (message.guild.emojis.length < 20) {
        const description_1 = Array.from(message.guild.emojis)
          .filter(
            (e) =>
              e.available &&
              (e.roles.size >= 1
                ? e.roles.intersect(message.guild.members.get(client.user.id))
                    .size >= 1
                : true)
          )
          .map(
            (x, i) =>
              `**${++i}.** ${
                x.animated ? `<a:${x.name}:${x.id}>` : `<:${x.name}:${x.id}>`
              } \`(${x.name})\``
          )
          .join("\n");
        const embed_roles_20 = new RichEmbed()
          .setColor(client.color)
          .setAuthor(
            message.guild.name,
            undefined,
            message.guild.dynamicIconURL()
          )
          .setDescription(description_1);
        if (unavailable > 0) {
          embed_roles_20.addField(
            "Emojis no disponibles:",
            message.guild.emojis
              .filter((e) => !e.available)
              .map(
                (x) =>
                  `${
                    x.animated
                      ? `<a:${x.name}:${x.id}>`
                      : `<:${x.name}:${x.id}>`
                  }`
              )
              .join("\n")
          );
        }
        return message.channel.createMessage({ embed: embed_roles_20 });
      }

      let a = 20;
      let emojiList = new Array();
      for (let b = 0; b < message.guild.emojis.length; b += 20) {
        let emojis = Array.from(message.guild.emojis)
          .slice(b, a)
          .filter(
            (e) =>
              e.available &&
              (e.roles.size >= 1
                ? e.roles.intersect(message.guild.members.get(client.user.id))
                    .size >= 1
                : true)
          )
          .map((r) => r); /* .slice(b, a);*/
        let j = b;
        a += 25;
        emojiList.push(
          emojis
            .map(
              (x) =>
                `**${++j}.** ${
                  x.animated ? `<a:${x.name}:${x.id}>` : `<:${x.name}:${x.id}>`
                } \`(${x.name})\``
            )
            .join("\n")
        );
      }

      let limit = emojiList.length <= 6 ? emojiList.length : 6;
      let embeds = [];

      for (let i = 0; i < limit; i++) {
        const desc = String(emojiList[i]).substr(0, 2048);
        const embed_roles = new RichEmbed()
          .setColor(client.color)
          .setAuthor(
            message.guild.name,
            undefined,
            message.guild.dynamicIconURL()
          )
          .setFooter(
            "Las reacciones solo servirán durante 20 segundos.",
            message.author.dynamicAvatarURL()
          )
          .setDescription(desc);
        if (unavailable > 0) {
          embed_roles.addField(
            "Emojis no disponibles:",
            message.guild.emojis
              .filter((e) => !e.available)
              .map(
                (x) =>
                  `${
                    x.animated
                      ? `<a:${x.name}:${x.id}>`
                      : `<:${x.name}:${x.id}>`
                  }`
              )
              .join("\n")
          );
        }
        embeds.push(embed_roles);
      }
      await SwapPages(client, message, 20000, 10, embeds);
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`${error.stack}`, "js")
      );
    }
  }
};
