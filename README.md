# DebtCollectorBot

### About
A discord bot that can track debts between discord users.

### Implementation
Uses discord.js and node to interact with the Discord API. A RDS mySQL database is setup on AWS for storing debt transaction data.

### Setup
Create a new discord bot and add it to a discord server.

Enter your discord bot token and mysql credentials as environment values. 

Required values are `process.env["DISCORD_TOKEN"]`, `process.env["DATABASE_ENDPOINT"]`, `process.env["DATABASE_USER]`, `process.env["DATABASE_PASSWORD]`, and `process.env["DATABASE_PORT]`.

Create a `config.json` file with the desired bot command prefix.

`config.json`
```json
{
  "prefix": "!"
}
```

Run `npm install`

Run `node index.js`
