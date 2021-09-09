function Markdown(str, lang) {
  return `\`\`\`${lang}\n${str}\n\`\`\``;
}

module.exports = {
  Markdown: Markdown,
};
