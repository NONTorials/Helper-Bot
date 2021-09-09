async function InitEvents(client) {
  const Read = require("util").promisify(require("fs").readdir);
  const Events = await Read("./Events/Client");
  Events.forEach((e) => {
    e = e.split(".");
    client.on(e[0], (...args) =>
      new (require(`../Events/Client/${e[0]}.js`))(client).run(...args)
    );
  });
}

module.exports = {
  InitEvents: InitEvents,
};
