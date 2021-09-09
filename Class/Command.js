class Command {
  constructor(
    client,
    {
      name = null,
      aliases = [],
      description = null,
      usage = null,
      example = null,
      category = null,
      PermissionsBot = [],
      PermissionsUser = [],
      cooldown = 0,
      nsfw = false,
      args = false,
      dev = false,
      enable = true,
    }
  ) {
    this.client = client;
    this.information = {
      name,
      aliases,
      description,
      usage,
      example,
      cooldown,
      category,
    };
    this.configuration = {
      PermissionsBot,
      PermissionsUser,
      nsfw,
      args,
      dev,
      enable,
    };
  }
}

module.exports = Command;
