module.exports = class Error {
  constructor(client) {
    this.client = client;
  }
  async run(err, id) {
    console.log(`❌ | Se produjo un error en la shard ${id}.\n${err}`);
  }
};
