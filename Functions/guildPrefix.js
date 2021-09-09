const SchemaPrefix = require("../Database/Schema/CustomPrefix.js");

async function guildPrefix(message) {
  if (!message.guild) return;
  let custom;

  const data = await SchemaPrefix.findOne({
    guildID: message.guild.id,
  }).catch((err) => console.log(err));

  if (data) {
    custom = data.prefix;
  } else {
    custom = message.guild.id === '312846399731662850' ? 'h.' : "h!";
  }
  return custom;
}

module.exports = {
  guildPrefix: guildPrefix,
};
