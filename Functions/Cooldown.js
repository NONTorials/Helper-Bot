const { Collection } = require("eris-pluris");
const fabricio = require("@fabricio-191/ms");

const Cooldown = new Collection();

async function checkCooldown(message, cmd, args) {
  const id =
    message.author.id +
    cmd.information.name +
    cmd.information.aliases.join(" ");
  const tiempo = cmd.information.cooldown * 1000;

  if (!cmd.client.devs.includes(message.author.id) && Cooldown.has(id)) {
    message.channel.createMessage(
      `Debes esperar **${fabricio(Cooldown.get(id) - Date.now(), {
        long: false,
        language: "es",
        length: 1,
      })}** para volver a usar ese comando.`
    );
    return false;
  }
  if (cmd) cmd.run(message, args);
  Cooldown.set(id, Date.now() + tiempo);
  setTimeout(() => {
    Cooldown.delete(id);
  }, tiempo);
}

module.exports = checkCooldown;
