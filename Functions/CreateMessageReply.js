function createMessageReply(message, content) {
  message.channel.createMessage({
    content: content,
    messageReferenceID: message.id,
  });
}

module.exports = {
  createMessageReply: createMessageReply,
};
