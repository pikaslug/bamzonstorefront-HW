const mysql = require('mysql');
const inquirer = require('inquirer');
const fs = require('fs');
const Table = require('easy-table');
const moment = require('moment');
const logger = require('./utils/func/logger.js');


let connection = mysql.createConnection({
  host     : 'localhost',
  user     : process.env.MYSQL_USR,
  password : process.env.MYSQL_PWD,
  database : 'bamazon'
});

initialize(prompt);


function initialize(callback) {
  let sql = `
    SELECT item_id as 'ID',
      product_name as 'Product',
      price as 'Price'
    FROM products`;

  connection.query(sql, function(err, result) {
    if (err) throw err;

    console.log();
    console.log("Product available for sale:");
    console.log(Table.print(result));
    console.log();

    callback();
  })

}


function prompt() {
  inquirer.prompt([
    {
      message: "Which product would you like to purchase? (product id)",
      name: "product_id",
      default: 1,
      validate: isNumber
    },
    {
      message: "How many units would you like to purchase? (quantity)",
      name: "quantity",
      default: 1,
      validate: isNumber
    }
  ]).then(function(answers) {
    checkInventory(
      parseInt(answers.product_id),
      parseInt(answers.quantity)
    );
  })
}


function checkInventory(id, quant) {
  let sql = `
    SELECT stock_quantity
    FROM products
    WHERE item_id = ?`

  connection.query(sql, [id], function(err, result, fields) {
    if (err) throw err;

    let stock = result[0]['stock_quantity']
    if (stock >= quant) {
      purchaseProducts(id, quant);
    } else {
      console.log(`Insufficient quantity!`)
      if (stock === 0) {
        console.log("We are out of stock.")
      } else {
        console.log(`We only have ${stock} units on hand.`)
      }
      logger.writeToLog("warn", `An attempt was made to purchase ${quant} units of item ${id}`)
      connection.end();
    }
  })
}


function purchaseProducts(id, quant) {
  let sql = `
    UPDATE products
    SET stock_quantity = stock_quantity - ?,
      product_sales = product_sales + (price * ?)
    WHERE item_id = ?;`;

  connection.query(sql, [quant, quant, id], function(err, result) {
    if (err) throw err;
    showPurchaseTotal(id, quant);
  })
}


function showPurchaseTotal(id, quant) {
  let sql = `
    SELECT price * ? as 'Total (USD)'
    FROM products
    WHERE item_id = ?`;

  connection.query(sql, [quant, id], function(err, result) {
    if (err) throw err;

    console.log();
    console.log(Table.print(result))
    console.log();

    connection.end();
    logger.writeToLog("info", `Purchased ${quant} units of product id ${id} for a total of ${result[0]["Total (USD)"]}`);
  })
}


function isNumber(val) {
  return !isNaN(parseFloat(val)) && isFinite(val)
}
