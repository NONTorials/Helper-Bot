module.exports = class NodeConnect {
  constructor(client) {
    this.client = client;
  }
  async run(node) {
    console.log(`✔️ | Node "${node.options.identifier}" connected.`);
  }
};
