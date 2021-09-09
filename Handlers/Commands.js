async function InitCommands(client) {
  const Read = require("util").promisify(require("fs").readdir);
  const Commands = await Read("./Commands");
  Commands.forEach(async (cmds) => {
    let commands = await Read("./Commands/" + cmds);
    commands
      .filter((cmd) => cmd.split(".").pop() === "js")
      .forEach(async (cmd) => {
        let log = await client.cargador("./Commands/" + cmds, cmd);
        if (log) console.log(log);
      });
  });
}

module.exports = {
  InitCommands: InitCommands,
};
