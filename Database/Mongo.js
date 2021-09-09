const Moongose = require("mongoose");

Moongose.connect(
  process.env.MONGO_URI,
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
