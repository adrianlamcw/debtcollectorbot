const {getUserName} = require("../utils.js")
//const {getUsername} = require("../newutils")

module.exports = {
    name: "top",
    description: "Display top 10 debtors",
    args: false,
    execute(message, args, client, db) {
        getTopDebtors(message, client, db)
    }
}

async function getTopDebtors(message, client, db, count = 10) {
    const rows = await db(`
        SELECT DISTINCT borrower_id, SUM(debt_amount) AS total
        FROM DebtDatabase.debt_transactions
        GROUP BY borrower_id
        ORDER BY total DESC
        LIMIT ${count};
        `)
    
    let text = "Top Debt Holders\n"
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        
        const id = row.borrower_id
        const amount = row.total
        
        const placeholder = "Unknown User"
        const name = await getUserName(client, id).catch(() => placeholder)
        text += `${i + 1}. ${name.username || placeholder}: ${amount}\n`
    }
    console.log(text);
    message.channel.send(`${text}`)
}
