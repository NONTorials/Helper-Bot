const Command = require("../../Class/Command.js");
const Eris = require("eris-pluris");
const { SwapPages } = require("../../Functions/SwapPages.js");

module.exports = class RoleList extends Command {
  constructor(client) {
    super(client, {
      name: "rolelist",
      aliases: ["rl"],
      description: "Muestra la lista de roles en el servidor.",
      usage: "rolelist",
      example: "rolelist",
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
      if (!message.guild.roles.size) {
        return message.channel.createMessage(`No hay roles en el servidor.`);
      }

      if (message.guild.roles.size <= 20) {
        const description_1 = Array.from(message.guild.roles)
          .map((r) => r[1])
          .sort((x, y) => y.position - x.position)
          .filter((x) => x.id === x.guild.id)
          .map((x, i) => `**${++i}.** <@&${x.id}>`);
        const embed_roles_20 = new Eris.RichEmbed()
          .setColor(client.color)
          .setAuthor(
            message.guild.name,
            undefined,
            message.guild.dynamicIconURL()
          )
          .setDescription(description_1.join("\n"));
        return message.channel.createMessage({ embed: embed_roles_20 });
      }

      const descriptions = [];
      let rolesPerPage = 20;
      const roles = message.guild.roles.filter((x) => x.id !== x.guild.id).sort((x, y) => y.position - x.position).map((x, i) => `**${i+1}.** <@&${x.id}>`);
      let i = 0;
      for (const role of roles) {
        if (!Array.isArray(descriptions[i])) descriptions[i] = [];
        descriptions[i].push(role);
        if (descriptions[i].length >= rolesPerPage || descriptions[i].join('\n').length >= 4096) ++i;
      }
      
      const embeds = [];
      for (const description of descriptions) {
        const embed = new Eris.RichEmbed()
        .setColor(client.color)
        .setAuthor(message.guild.name, undefined, message.guild.dynamicIconURL())
        .setFooter('Las reacciones solo servirán durante 15 segundos.', message.author.dynamicAvatarURL())
        .setDescription(description.join('\n'));
        embeds.push(embed);
      }
      
      await SwapPages(client, message, 15000, 10, embeds);
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
