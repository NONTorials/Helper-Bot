module.exports = class Ready {
  constructor(client) {
    this.client = client;
  }
  async run() {
    const client = this.client;
    client.manager.init(client.user.id);
    console.log(`✔️ | ${client.user.username} is ready.`);
    client.editStatus("idle", {
      name: "A Discord Bot in Eris",
      type: 3,
    });
  }
};
