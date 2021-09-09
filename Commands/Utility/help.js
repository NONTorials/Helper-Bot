const { removeMarkdown } = require('../../Functions/String');
const Command = require("../../Class/Command.js");
const { RichEmbed } = require("eris-pluris");

module.exports = class Help extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      aliases: ["h"],
      description:
        "Muestra los comandos del bot ó proporciona información acerca de un comando.",
      usage: "help [command-name]",
      example: "help ping",
      category: "Utility",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: [],
      cooldown: 5,
      nsfw: false,
      args: true,
      dev: false,
      enable: true,
    });
  }
  async run(message, args) {
    const client = this.client;
    const prefix = removeMarkdown(await client.guildPrefix(message));
    const categories = this._getCategories(message);
    const noArgsEmbed = new RichEmbed()
        .setColor(client.color)
        .setThumbnail(client.user.dynamicAvatarURL())
        .setTitle('Página de ayuda')
        .setDescription(`¡Hola! Soy **${client.user.username}**, un bot con diversas funciones, en las que destacan la música, economía y moderación para tu servidor.\nMi prefix en este servidor es **${prefix}**, por lo que todos mis comandos empezarán con este mismo.\nActualmente cuento con **${Object.keys(categories).length}** categorías, las cuales cuentan con **${Object.keys(categories).map((x) => categories[x].commands.length).reduce((x, y) => x + y, 0)}** comandos en total.\n\n${Object.keys(categories).map((x) => `\`${prefix}help ${x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()}\` | **Comandos de ${categories[x].alias}** **[${categories[x].commands.length}]**`).join('\n')}`)
        .setTimestamp()
        .setFooter(`TIP: Usa "${prefix}help <categoría>" para ver todos los comandos de una categoría`);
    
    if (!args[0]) return message.channel.createMessage({ embed: noArgsEmbed });

    const text = args[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    let category = Object.keys(categories).find((x) => [x.toLowerCase(), categories[x].alias.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()].some((x) => x === text));
    category = categories[category];
    if (category) {
      const categoryEmbed = new RichEmbed()
        .setColor(client.color)
        .setThumbnail(client.user.dynamicAvatarURL())
        .setTitle(`Comandos de ${category.alias} [${category.commands.length}]`)
        .setDescription(`${category.commands.map((x, i) => `\`${i+1}.\` **${x.information.name}**: ${x.information.description.length > 40 ? x.information.description.substr(0, 40) + '...' : x.information.description}`).join('\n')}`)
        .setTimestamp()
        .setFooter(`TIP: Usa "${prefix}help <comando>" para ver más información sobre un comando`);
      return message.channel.createMessage({ embed: categoryEmbed });
    } else {
      const command = client.commands.find((x) => (x.information.name == text || x.information.aliases?.includes(text)) && (client.devs.includes(message.author.id) || !x.configuration.dev));
      if (command) {
        const titleCase = (str) => str.split(' ').map((x) => x[0].toUpperCase() + x.slice(1).toLowerCase()).join(' ');
        const commandEmbed = new RichEmbed()
          .setColor(client.color)
          .setThumbnail(client.user.dynamicAvatarURL())
          .setTitle(`Información del comando ${titleCase(command.information.name)}`)
          .addField('Nombre', '> ' + command.information.name, true)
          .addField('Aliases', `> ${command.information.aliases.join(' ') || 'Ninguno'}`, true)
          .addField('Descripción', '> ' + command.information.description || 'No tiene', true)
          .addField('Permisos [Bot]', '> ' + (command.configuration['PermissionsBot'].length ? command.configuration['PermissionsBot'].map((x) => `${this._humanizePerm(x)}`).join(',\n> ') : 'Ninguno'), true)
          .addField('Permisos [Usuario]', '> ' + (command.configuration['PermissionsUser'].length ? command.configuration['PermissionsUser'].map((x) => `${this._humanizePerm(x)}`).join(',\n> ') : 'Ninguno'), true)
          .addField('\u200b', '\u200b', true)
          .addField('Uso', '> ' + (prefix + command.information.usage), true)
          .addField('Ejemplo', '> ' + (prefix + command.information.example), true)
          .addField('Cooldown', `${command.information.cooldown ? `> ${command.information.cooldown} segundos` : '> No tiene'}`, true)
          .addField('Datos adicionales', `> **¿Requiere argumentos?**: ${command.configuration.args ? 'Sí' : 'No'}\n> **¿NSFW?**: ${command.configuration.nsfw ? 'Sí' : 'No'}\n> **¿Está en mantenimiento?**: ${!command.configuration.enable ? 'Sí' : 'No'}\n> **¿Sólo para desarrolladores?**: ${command.configuration.dev ? 'Sí' : 'No'}`)
          .setTimestamp()
          .setFooter(`TIP: Usa "${prefix}help ${this._getAlias(command.information.category)?.toLowerCase()}" para ver comandos relacionados al comando "${command.information.name}"`);
        return message.channel.createMessage({ embed: commandEmbed });
      } else return message.channel.createMessage({ embed: noArgsEmbed });
    }
  }
  
  _commands(message) {
    return this.client.commands.filter((x) => this.client.devs.includes(message.author.id) ? true : !x.configuration.dev);
  }

  _getCategories(message) {
    const categories = {};
    this._commands(message)
    .forEach((cmd) => {
      const category = cmd.information.category;
      if (!(category in categories)) categories[category] = {};
      if (!('alias' in categories[category])) categories[category]['alias'] = this._getAlias(category);
      if (!('commands' in categories[category])) categories[category]['commands'] = [];
      categories[category]['commands'].push(cmd);
    });
    return categories;
  }

  _getAlias(category) {
    switch (category?.toLowerCase()) {
      case 'developers':
        return 'Desarrolladores';
        break;
      case 'economy':
        return 'Economía';
        break;
      case 'music':
        return 'Música';
        break;
      case 'settings':
        return 'Ajustes';
        break;
      case 'utility':
        return 'Utilidad';
        break;
      default:
        return 'categoría desconocida';
        break;
    }
  }
  
  _humanizePerm(perm) {
    perm = perm.replace(/[A-Z]/g, (x) => ` ${x}`);
    if (perm.split(' ').join('').includes('VAD'))
      perm = perm.replace(new RegExp('V A D', 'i'), 'Voice Activity Detection');
    perm = perm.replace(/Voice /i, '');
    if (perm.split(' ').join('').includes('TTS'))
      perm = perm.replace(new RegExp('T T S', 'i'), 'Text-To-Speech');
    perm = perm[0].toUpperCase() + perm.slice(1).toLowerCase();
    
    return perm;
  }
}
