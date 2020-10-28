import * as Discord from "discord.js"
import * as Database from "mysql"

export function getDatabase(): Database.Connection {
    const connection = Database.createConnection({
        host: process.env["DATABASE_ENDPOINT"],
        user: process.env["DATABASE_USER"],
        password: process.env["DATABASE_PASSWORD"],
        port: Number(process.env["DATABASE_PORT"]),
    })
    connection.connect()
    return connection
}

export async function getUsername(client: Discord.Client, id: string, placeholder: string = "Unknown User"): Promise<string> {
    return client.users.fetch(id).then(user => user.username).catch(() => placeholder)
}
