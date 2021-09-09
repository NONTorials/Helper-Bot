const Command = require("../../Class/Command.js");

module.exports = class Invite extends Command {
  constructor(client) {
    super(client, {
      name: "invite",
      aliases: ["inv"],
      description: "Envía la invitación del bot",
      usage: "invite",
      example: "invite",
      category: "Utility",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: [],
      cooldown: 4,
      nsfw: false,
      args: false,
      dev: false,
      enable: true,
    });
  }
  async run(message, args) {
    const client = this.client;
    try {
      const link_con_permisos_8 = `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`;
      message.channel.createMessage({
        content: "Invítame dando click en el botón.",
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: "Click Aquí",
                style: 5,
                emoji: {
                  name: "✨",
                },
                url: link_con_permisos_8,
              },
            ],
          },
        ],
      });
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
