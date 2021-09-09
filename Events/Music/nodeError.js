module.exports = class NodeError {
  constructor(client) {
    this.client = client;
  }
  async run(node, error) {
    console.log(
      `❌ | Node "${node.options.identifier}" encountered: ${error.message}.`
    );
  }
};
