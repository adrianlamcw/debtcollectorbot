const { prefix } = require("../config.json");

module.exports = {
  name: "help",
  description: "Help list",
  cooldown: 5,
  execute(message, args) {
    message.channel.send(`List of commands: 
    ${prefix}help: Get this list 
    ${prefix}lend: Lend money to a friend
    ${prefix}sum: Get summary of loans
    ${prefix}ping: Pong!`);
  },
};
