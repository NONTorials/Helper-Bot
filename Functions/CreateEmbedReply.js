function createEmbedReply(message, embed) {
  message.channel.createMessage({
    embed: embed,
    messageReferenceID: message.id,
  });
}

module.exports = {
    createEmbedReply: createEmbedReply,
};
