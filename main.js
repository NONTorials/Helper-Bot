require('dotenv').config();

const Helper = require("./Class/Client.js");
const client = new Helper(process.env.DISCORD_TOKEN);

require("./Database/Mongo.js");
require("./Handlers/Commands.js").InitCommands(client);
require("./Handlers/Events.js").InitEvents(client);
require("./Handlers/Erela.js").InitErelaJS(client);
client.connect();