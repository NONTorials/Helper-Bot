const { Client, Collection } = require("eris-pluris");
const { colors } = require("../config.js");
const { emojis } = require("../config.js");
const { Markdown } = require("../Functions/Markdown.js");
const { toUpperCase } = require("../Functions/ToUpperCase.js");
const { SpotifyApi } = require("../Functions/Spotify.js");
const { createMessageReply } = require("../Functions/CreateMessageReply.js");
const { createEmbedReply } = require("../Functions/CreateEmbedReply.js");
const { guildPrefix } = require("../Functions/guildPrefix.js");
const CatchError = require("./Error.js");
const EconomySchema = require("../Database/Schema/Economy.js");

class Helper extends Client {
  constructor(token, options) {
    super(token, options);
    this.options.restMode = true;
    this.options.defaultImageFormat = "png";
    this.options.defaultImageSize = 2048;
    this.options.disableEvents = {
      PRESENCE_UPDATE: false,
      TYPING_START: false,
      GUILD_BAN_ADD: false,
      GUILD_BAN_REMOVE: false,
      GUILD_MEMBER_ADD: false,
      GUILD_MEMBER_REMOVE: false,
      GUILD_ROLE_CREATE: false,
      GUILD_ROLE_DELETE: false,
      GUILD_ROLE_UPDATE: false,
      INVITE_CREATE: false,
    }
    this.commands = new Collection();
    this.sep = require("path").sep;
    this.colors = colors;
    this.emotes = emojis;
    this.markdown = Markdown;
    this.createMessageReply = createMessageReply;
    this.createEmbedReply = createEmbedReply;
    this.touppercase = toUpperCase;
    this.guildPrefix = guildPrefix;
    this.spotify = SpotifyApi;
    this.queue = new Map();
    this.skipvote = new Map();
    this.snipes = new Map();
    this.customError = CatchError;
    this.devs = ["221399196480045056", "686766483350880351"];
    this.color = 0x2769ff;
  }

  async cargador(direccion, nombre) {
    try {
      const cmds = new (require(`.${direccion}${require("path").sep
        }${nombre}`))(this);
      cmds.configuration.direction = direccion;
      if (cmds.init) cmds.init(this);
      this.commands.set(cmds.information.name, cmds);
    } catch (error) {
      console.error(e);
    }
  }

  async addMoney(user, amount) {
    EconomySchema.findOne({ userID: user.id }, async (err, res) => {
      if (err) throw err;
      if (res) {
        res.money += amount;
      } else {
        res = new EconomySchema({
          userID: user.id,
          money: amount,
        });
      }
      await res.save();
    });
  }

  async removeMoney(user, amount) {
    EconomySchema.findOne({ userID: user.id }, async (err, res) => {
      if (err) throw err;
      if (res) {
        res.money -= amount;
      } else {
        res = new EconomySchema({
          userID: user.id,
          money: -amount,
        });
      }
      await res.save();
    });
  }

  async userBalance(user) {
    new Promise(async (full) => {
      const data = EconomySchema.findOne({ userID: user.id });
      if (!data) return full(0);
      full(data.money);
    });
  }
}

module.exports = Helper;
