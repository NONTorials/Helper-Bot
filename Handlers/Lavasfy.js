const { LavasfyClient } = require("lavasfy");
function InitLavasFyClient(client) {
  client.lavasfy = new LavasfyClient(
    {
      clientID: "5e5d4eb669814f9eb9547defe8fbad9f",
      clientSecret: "8761388b35ce4de3bd1a3146b7a64634",
    },
    [
      {
        id: "main",
        host: "localhost",
        port: 9000,
        password: "password3075",
      },
    ]
  );
}

module.exports = {
  InitLavasFyClient: InitLavasFyClient,
};
