const { getUserFromMention } = require("../utils.js");
const { prefix } = require("../config.json");

module.exports = {
  name: "sum",
  description: "Check total loaned amount of a user",
  execute(message, args, client, db) {
    //Check command arguments and command
    if (args.length != 1) {
      return message.channel.send(
        `Proper format for summary of user. \nEx: ${prefix}sum @user`
      );
    }

    //Get user from mention
    const borrower = getUserFromMention(args[0], client);

    //Error checking
    if (!borrower) {
      return message.channel.send(
        `User not found. Note you cannot copy/paste a mention`
      );
    }

    //Check summary
    checkSum(message, args, db, borrower, client);
  },
};

async function checkSum(message, args, db, borrower, client) {
  try {
    let rows = await db(`
      SELECT lender_id, borrower_id, SUM(debt_amount) as total
        FROM DebtDatabase.debt_transactions 
          WHERE borrower_id = ${borrower.id}
        GROUP BY lender_id
    `)
    if (!rows.length){
      return message.channel.send(
        `No details for ${borrower.username}`
      );
    }
    message.channel.send(`Loan details: for ${borrower.username}`);
    for(i=0; i<rows.length; i++){
      let user = client.users.cache.get(rows[i].lender_id);
      message.channel.send(`They owe ${user.username} $${rows[i].total}`);
    }
  } catch (error) {
    message.reply("Query error");
    console.log(error);
  }
}
