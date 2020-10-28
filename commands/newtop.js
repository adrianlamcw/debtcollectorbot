"use strict";
const newutils_1 = require("../newutils");
function getTopDebtors(message, client, database, count = 10) {
    const statement = `
        SELECT DISTINCT borrower_id, SUM(debt_amount) AS total
        FROM DebtDatabase.debt_transactions
        GROUP BY borrower_id
        ORDER BY total DESC
        LIMIT ${count};`;
    database.query(statement, function (error, rows) {
        let text = "Top Debt Holders\n";
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const id = row.borrower_id;
            const amount = row.total;
            const name = newutils_1.getUsername(client, id);
            text += `${i + 1}. ${name}: ${amount}\n`;
        }
        message.channel.send(`${text}`);
    });
}
module.exports = {
    name: "newtop",
    description: "Display top debtors",
    args: false,
    execute(message, args, client, database) {
        getTopDebtors(message, client, database);
    }
};
//# sourceMappingURL=newtop.js.map