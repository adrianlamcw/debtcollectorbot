const { getDatabase, checkSpam } = require("./utils.js");
const fs = require("fs");
const { prefix, discordToken } = require("./config.json");
const Discord = require("discord.js");

const db = getDatabase();
const client = new Discord.Client();
const cooldowns = new Discord.Collection();

//Setup commands to be dynamically drawn from command folder
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("Ready!");
});

client.login(discordToken);

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  console.log(message.content);

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  //Check for user spam
  checkSpam(cooldowns, command, message);

  try {
    command.execute(message, args, client, db);
  } catch (error) {
    console.error(error);
    message.reply("There was an error trying to execute that command!");
  }
});
