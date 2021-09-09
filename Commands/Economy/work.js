const Command = require("../../Class/Command.js");

module.exports = class Work extends Command {
  constructor(client) {
    super(client, {
      name: "work",
      aliases: [],
      description: "Trabaja para conseguir dinero.",
      usage: "work",
      example: "work",
      category: "Economy",
      PermissionsBot: ["viewChannel", "sendMessages", "embedLinks"],
      PermissionsUser: [],
      cooldown: 1000 * 15,
      nsfw: false,
      args: false,
      dev: false,
      enable: true,
    });
  }
  async run(message, args) {
    const client = this.client;
    try {
      const trabajos = [
        `Eres un programador y desarrollas un Bot de Discord.`,
        `Eres un chef profesional y cocinas una barbacoa muy rica.`,
        `Eres un médico y hoy curaste a 5 personas.`,
        `Trabajas como mecánico y reparas un Mercedes Benz.`,
        `Trabajas como conductor de autobús durante 5 horas.`,
        `Trabajaste como Abogado`,
        `Trabajaste como Maestro`,
        `Trabajaste como Astronauta`,
        `Trabajaste como Cantante`,
        `Trabajaste como Ingeniero`,
        `Trabajaste como Recolector de basura`,
        `Trabajaste como Fumigador`,
        `Trabajaste como Mesero`,
        `Trabajaste como Camarera`,
        `Trabajaste como Camarero`,
        `Trabajaste como Enfermero`,
        `Trabajaste como Enfermera`,
        `Trabajaste como Taxista`,
        `Trabajaste como Actor`,
        `Trabajaste como Escritor`,
        `Trabajaste como Licenciado`,
        `Trabajaste como Niñera`,
        `Trabajaste como Niñero`,
        `Trabajaste como Vendedor de tacos`,
        `Trabajaste como Vendedor de hot dogs`,
        `Trabajaste como Vendedor de empanadas`,
      ];

      const trabajo_final = Math.floor(Math.random() * trabajos.length);
      const dinero_ganado = Math.floor(Math.random() * 45) + 1;

      await client.addMoney(message.author, dinero_ganado);
      message.channel.createMessage(
        `${trabajos[trabajo_final]}. Ganaste :coin: **${dinero_ganado}** coins.`
      );
    } catch (error) {
      client.createMessage(
        message.channel.id,
        client.markdown(`Error: ${error.message}`, "js")
      );
    }
  }
};
