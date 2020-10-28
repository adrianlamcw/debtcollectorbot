import {Client, Message} from "discord.js"
import {Connection} from "mysql"
import {getUsername} from "../newutils"

export = {
    name: "newtop",
    description: "Display top debtors",
    args: false,
    execute(message: Message, args: string[], client: Client, database: Connection) {
        getTopDebtors(message, client, database)
    }
}

function getTopDebtors(message: Message, client: Client, database: Connection, count: number = 10) {
    const statement = `
        SELECT DISTINCT borrower_id, SUM(debt_amount) AS total
        FROM DebtDatabase.debt_transactions
        GROUP BY borrower_id
        ORDER BY total DESC
        LIMIT ${count};`
    
    database.query(statement, function (error, rows) {
        let text = "Top Debt Holders\n"
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            
            const id = row.borrower_id
            const amount = row.total
            
            const name = getUsername(client, id)
            text += `${i + 1}. ${name}: ${amount}\n`
        }
        message.channel.send(`${text}`)
    })
}
