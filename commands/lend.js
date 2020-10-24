const { getUserFromMention } = require("../utils.js");
const { prefix } = require("../config.json");

module.exports = {
  name: "lend",
  description: "Add lend transaction",
  execute(message, args, client, db) {
    //Check command arguments and command
    if (!args.length) {
      return message.channel.send(
        `Proper format for lending a "friend" $20. \nEx: ${prefix}lend @friend 20 
        \nFor lending "friend_A", "friend_B", "friend_C", etc... $20 each \nEx: ${prefix}lend @friend_A @friend_B @friend_C 20
        \nCan also undo/remove money. \nEx: !lend @friend -20 \nEx: ${prefix}lend @friend_A @friend_B @friend_C -20`
      );
    }
    if (isNaN(args[args.length - 1])) {
      return message.channel.send(
        `The last value is not a number! Check your formatting. Type !lend for help.`
      );
    }
    if (args[args.length - 1] > 100000 || args[args.length - 1] < -100000) {
      return message.channel.send(`Value too high!`);
    }
    //Round to 2 decimals
    args[args.length - 1] = parseFloat(args[args.length - 1]).toFixed(2);

    for (i = 0; i < args.length - 1; i++) {
      //Get user from mention
      const borrower = getUserFromMention(args[i], client);

      //Check borrower id
      if (!borrower) {
        return message.channel.send(
          `User not found. Note you cannot copy/paste a mention. Type !lend for help`
        );
      }
      if (borrower.id === message.author.id) {
        return message.channel.send(`Trying to borrow money from yourself?`);
      }

      //Begin adding lend transation
      addLendTransaction(message, args, db, borrower);
    }
  },
};

async function addLendTransaction(message, args, db, borrower) {
  try {
    const insert = await db(`
      INSERT INTO DebtDatabase.debt_transactions (lender_id, borrower_id, debt_amount)
        VALUES (${message.author.id}, ${borrower.id}, ${
      args[args.length - 1]
    });`);
    const rows = await db(`
      SELECT lender_id, borrower_id, SUM(debt_amount) as total FROM DebtDatabase.debt_transactions  
        WHERE borrower_id = ${borrower.id}
        AND lender_id = ${message.author.id}
    `);
    message.channel.send(
      `Transaction Added Succesfully, Transaction ID: ${insert.insertId} \n${borrower.username} now owes you $${rows[0].total}`
    );
  } catch (error) {
    message.reply("Query error");
    console.log(error);
  }
}
