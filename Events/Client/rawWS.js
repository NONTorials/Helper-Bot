module.exports = class RawWS {
  constructor(client) {
    this.client = client;
  }
  async run(d) {
    const client = this.client;
    client.manager.updateVoiceState(d);
  }
};
