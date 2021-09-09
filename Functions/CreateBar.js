function createBar(player) {
  try {
    if (!player.queue.current)
      return `**[<a:cdmusic:781188506981498891>${line.repeat(
        size - 1
      )}]**\n\`00:00:00 / 00:00:00\``;
    let current =
      player.queue.current.duration !== 0
        ? player.position
        : player.queue.current.duration;
    let total = player.queue.current.duration;
    let size = 18;
    let line = "▬";
    let slider = "<a:cdmusic:781188506981498891>";
    let bar =
      current > total
        ? [line.repeat((size / 2) * 2), (current / total) * 100]
        : [
            line
              .repeat(Math.round((size / 2) * (current / total)))
              .replace(/.$/, slider) +
              line.repeat(size - Math.round(size * (current / total)) + 1),
            current / total,
          ];
    if (!String(bar[0]).includes("<a:cdmusic:781188506981498891>"))
      return `**[<a:cdmusic:781188506981498891>${line.repeat(
        size - 1
      )}]**\n\`00:00:00 / 00:00:00\``;
    return `**[${bar[0]}]**\n\`${
      new Date(player.position).toISOString().substr(11, 8) +
      " / " +
      (player.queue.current.duration == 0
        ? " 🔴 Live Stream"
        : new Date(player.queue.current.duration).toISOString().substr(11, 8))
    }\``;
  } catch (error) {
    console.log(e);
  }
}

module.exports = {
  createBar: createBar,
};
