const { readdirSync } = require("fs");
const client = require("../main.js");

let categorias = new Array();
const values = new Array();

readdirSync("../Commands").forEach((dir) => {
  const directories = readdirSync(`../Commands/${dir}`).filter((file) =>
    file.endsWith(".js")
  );

  directories.map((cmds) => {
    const file = new (require(`../Commands/${dir}/${cmds}`))(client);

    values.push({
      name: file.information.name ? file.information.name : "",
      description: file.information.description
        ? file.information.description
        : "",
      aliases: file.information.aliases,
      usage: file.information.usage ? file.information.usage : "",
    });
  });
  let data = new Object();

  data = {
    name: dir.toUpperCase(),
    values,
  };
  categorias.push(data);
});

module.exports = { categorias };
