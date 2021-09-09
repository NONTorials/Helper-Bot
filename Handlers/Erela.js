const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const Deezer = require("erela.js-deezer");
const Facebook = require("erela.js-facebook");
const AppleMusic = require("erela.js-apple");

async function InitErelaJS(client) {
  client.manager = new Manager({
    nodes: [
      {
        host: "localhost",
        port: 9000,
        password: "password3075",
      },
    ],
    plugins: [
      new Spotify({
        clientID: "5e5d4eb669814f9eb9547defe8fbad9f",
        clientSecret: "8761388b35ce4de3bd1a3146b7a64634",
      }),
      new Deezer(),
      new Facebook(),
      new AppleMusic(),
    ],
    send(id, payload) {
      const guild = client.guilds.get(id);
      if (guild) guild.shard.sendWS(payload.op, payload.d);
    },
  });
  const Read = require("util").promisify(require("fs").readdir);
  const Events = await Read("./Events/Music");
  Events.forEach((e) => {
    e = e.split(".");
    client.manager.on(e[0], (...args) =>
      new (require(`../Events/Music/${e[0]}.js`))(client).run(...args)
    );
  });
}

module.exports = {
  InitErelaJS: InitErelaJS,
};
