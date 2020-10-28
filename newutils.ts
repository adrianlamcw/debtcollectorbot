import * as Discord from "discord.js"
import * as Database from "mysql"

const {dbEndpoint, dbUser, dbPassword, dbPort} = require("./config.json")

export function getDatabase(): Database.Connection {
    const connection = Database.createConnection({
        host: dbEndpoint,
        user: dbUser,
        password: dbPassword,
        port: dbPort,
    })
    connection.connect()
    return connection
}

export async function getUsername(client: Discord.Client, id: string, placeholder: string = "Unknown User"): Promise<string> {
    return client.users.fetch(id).then(user => user.username).catch(() => placeholder)
}
