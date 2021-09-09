const Moongose = require("mongoose");

Moongose.connect(
  "mongodb+srv://DevEater:Byfabrox1997@discordbotineris.ejunk.mongodb.net/HelperBotDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (error) => {
    if (error) return console.error(error);
    console.log('✔️ | Node "MongoDB" connected.');
  }
);
