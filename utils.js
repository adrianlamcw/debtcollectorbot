const { dbEndpoint, dbUser, dbPassword, dbPort } = require("./config.json");
const mysql = require("mysql");
const util = require("util");
const Discord = require("discord.js");

module.exports = {
  getDatabase: function () {
    const connection = mysql.createConnection({
      host: dbEndpoint,
      user: dbUser,
      password: dbPassword,
      port: dbPort,
    });
    const db = util.promisify(connection.query).bind(connection);
    return db;
  },

  checkSpam: function (cooldowns, command, message) {
    //Check for user spam
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(
          `please wait ${timeLeft.toFixed(
            1
          )} more second(s) before reusing the \`${command.name}\` command.`
        );
      }
    } else {
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
  },

  getUserFromMention: function (mention, client) {
    // The id is the first and only match found by the RegEx. No copy pasting allowed (different ids)
    const matches = mention.match(/^<@!?(\d+)>$/);

    // If supplied variable was not a mention, matches will be null instead of an array.
    if (!matches) return;

    // However the first element in the matches array will be the entire mention, not just the ID,
    // so use index 1.
    const id = matches[1];

    return client.users.cache.get(id);
  },
};
