const Command = require("../../Class/Command.js");
const Schema = require("../../Database/Schema/Economy.js");
const AsciiTable = require("ascii-table");

module.exports = class Leaderboard extends Command {
  constructor(client) {
    super(client, {
      name: "leaderboard",
      aliases: ["lb", "top"],
      description: "Muestra el top de de usuarios con más dinero.",
      usage: "leaderboard",
      example: "leaderboard",
      category: "Economy",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: [],
      cooldown: 6,
      nsfw: false,
      args: false,
      dev: false,
      enable: true,
    });
  }
  async run(message, args) {
    const client = this.client;
    try {
      Schema.find()
        .sort([["money", "descending"]])
        .then(async (x) => {
          if (!x.length)
            return message.channel.createMessage({
              content: "No hay usuarios registrados en mi base de datos.",
            });
          const LeaderboardTable = new AsciiTable("Leaderboard");
          LeaderboardTable.setHeading("#", "Usuario", "Coins");
          let a = await x.slice(0, 10);
          a.map((x, i) =>
            LeaderboardTable.addRow(
              i + 1,
              client.users.has(x.userID)
                ? client.users.get(x.userID).username
                : "Unknown",
              x.money
            )
          );

          message.channel
            .createMessage({
              content: client.markdown(LeaderboardTable.toString(), "js"),
            })
            .catch((err) => {
              client.createMessage(
                message.channel.id,
                client.markdown(`Error: ${err.message}`, "js")
              );
            });
        });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
