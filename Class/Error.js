const Eris = require("eris-pluris");

function CatchError(str, client, message) {
  class HelperBotError extends Error {
    constructor(...a) {
      super(...a);
      this.name = `HelperBotError`;
    }
  }
  if (typeof str !== "string")
    return console.log("❌ | HelperBotError: El objeto recibido no es string");
  const e_message = new HelperBotError(`${str}`);
  const embedError = new Eris.RichEmbed()
    .setColor("#FF0000")
    .setAuthor(
      message.author.username,
      message.author.dynamicAvatarURL(),
      message.author.dynamicAvatarURL()
    )
    .setTitle("> **Ha ocurrido un error**")
    .setDescription(Markdown("❌ | " + e_message.stack));
  client.createMessage(message.channel.id, { embed: embedError });
}

function Markdown(str) {
  return `\`\`\`js\n${str}\n\`\`\``;
}

module.exports = CatchError;
