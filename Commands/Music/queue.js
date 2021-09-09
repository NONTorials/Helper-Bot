const { removeMarkdown } = require('../../Functions/String.js');
const { SwapPages } = require('../../Functions/SwapPages.js');
const { format } = require('../../Functions/Format.js');
const Command = require('../../Class/Command.js');
const { RichEmbed } = require('eris-pluris');

module.exports = class Queue extends Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      aliases: ['q'],
      description: 'Muestra la lista de canciones del servidor.',
      usage: 'queue',
      example: 'queue',
      category: 'Music',
      PermissionsBot: ['viewChannel', 'sendMessages', 'embedLinks'],
      PermissionsUser: [],
      cooldown: 6,
      nsfw: false,
      args: false,
      dev: false,
      enable: true,
    });
  }
  async run(message) {
    const client = this.client;
    const defaultOptions = {
      messageReference: {
        failIfNotExists: false,
        messageID: message.id
      },
      allowedMentions: {
        repliedUser: false
      }
    }
    try {
      const player = client.manager.players.get(message.guild.id);
      if (!player) return message.channel.createMessage({ content: 'No hay ninguna canción reproduciéndose en este servidor.', ...defaultOptions });
      if (player.queue.length > 0) {
        if (player.queue.length <= 20) {
          const songs = player.queue.map((x, i) => `**${i+1}. [${removeMarkdown(x.title.length > 35 ? `${x.title.substr(0, 35).trim()}...` : x.title)}](${x.uri})** [${format(x.duration).split('|')[0].trimEnd()}]`);
          const embed = new RichEmbed()
            .setAuthor(`${message.guild.name} • [ ${player.queue.length} canci${player.queue.length != 1 ? 'ones' : 'ón'} en la cola | ${format([...player.queue.map((x) => x.duration)].reduce((x, y) => x + y, 0) - player.position).split('|')[0].trimEnd()} ]`, undefined, message.guild.dynamicIconURL())
            .setColor(client.color)
            .addField('Reproduciendo:', `**[${removeMarkdown(player.queue.current.title)}](${player.queue.current.uri}) - [${player.queue.current.author}]**\n**»** ${player.queue.current.isStream ? `🔴 En vivo` : `${`${createProgressBar(player.position, player.queue.current.duration, 12)}\n**»** ${new Date(player.position).toISOString().substr(14, 5)} / ${format(player.queue.current.duration).split('|')[0].trimEnd()}`}`}`)
            .setDescription(songs.join('\n'));
          return message.channel.createMessage({ embed, ...defaultOptions });
        } else {
          const songs = [];
          let songsPerPage = 20;
          const songList = player.queue.map((x, i) => `**${i+1}. [${removeMarkdown(x.title.length > 35 ? `${x.title.substr(0, 35).trim()}...` : x.title)}](${x.uri})** [${format(x.duration).split('|')[0].trimEnd()}]`);
          let i = 0;
          for (const song of songList) {
            if (!Array.isArray(songs[i])) songs[i] = [];
            songs[i].push(song);
            if (songs[i].length >= songsPerPage || songs[i].join('\n').length >= 4096) ++i;
          }

          const embeds = [];
          for (const song of songs) {
            const embed = new RichEmbed()
            .setColor(client.color)
            .setAuthor(`${message.guild.name} • [ ${player.queue.length} canciones en la cola | ${format([...player.queue.map((x) => x.duration)].reduce((x, y) => x + y, 0) - player.position).split('|')[0].trimEnd()} ]`, undefined, message.guild.dynamicIconURL())
            .setFooter('Las reacciones solo servirán durante 15 segundos.', message.author.dynamicAvatarURL())
            .setDescription(song.join('\n'))
            .addField('Reproduciendo:', `**[${removeMarkdown(player.queue.current.title)}](${player.queue.current.uri}) - [${player.queue.current.author}]**\n**»** ${player.queue.current.isStream ? `🔴 En vivo` : `${`${createProgressBar(player.position, player.queue.current.duration, 12)}\n**»** ${new Date(player.position).toISOString().substr(14, 5)} / ${format(player.queue.current.duration).split('|')[0].trimEnd()}`}`}`);
            embeds.push(embed);
          }
          
          await SwapPages(client, message, 15000, 10, embeds);
        }
      } else {
        const embed = new RichEmbed()
          .setAuthor(message.guild.name + ' • [ No hay canciones en la cola ]', undefined, message.guild.dynamicIconURL())
          .setColor(client.color)
          .addField('Reproduciendo:', `**[${removeMarkdown(player.queue.current.title)}](${player.queue.current.uri}) - [${player.queue.current.author}]**\n**»** ${player.queue.current.isStream ? `🔴 En vivo` : `${`${createProgressBar(player.position, player.queue.current.duration, 12)}\n**»** ${new Date(player.position).toISOString().substr(14, 5)} / ${format(player.queue.current.duration).split('|')[0].trimEnd()}`}`}`);
          return message.channel.createMessage({ embed, ...defaultOptions });
      }
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, 'js')
      );
    }
  }
};

function createProgressBar(current, total, max) {
  const progress = Math.round(max * (current / total));
  const remain = max - progress;
  return `${[
    '**[' + '▬'.repeat(progress),
    '<a:cdmusic:884176165445726208>',
    '▬'.repeat(remain) + ']**',
  ].join('')}`;
}