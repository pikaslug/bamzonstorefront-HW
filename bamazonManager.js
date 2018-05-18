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


// Initial prompt
inquirer.prompt([
  {
    message: "What would you like to do?",
    type: "list",
    name: "option",
    choices: [
      'View Products for Sale',
      'View Low Inventory',
      'Add to Inventory',
      'Add New Product'
    ]
  }
]).then(function(answer) {

  switch (answer['option']) {
    case 'View Products for Sale':
      viewProductsForSale();
      break;

    case 'View Low Inventory':
      chooseInventoryThreshold()
      break;

    case 'Add to Inventory':
      chooseProductUpdate();
      break;

    case 'Add New Product':
      chooseNewProduct();
      break
  }
})


function viewProductsForSale() {
  let sql = `
    SELECT p.item_id as 'ID',
      p.product_name as 'Product',
      d.department_name as 'Department',
      p.price as 'Price (USD)',
      p.stock_quantity as 'Stock'
    FROM products p
    JOIN departments d USING (department_id)
    ORDER BY p.item_id`;

  connection.query(sql, function(err, result) {
    if (err) throw err;

    console.log(Table.print(result));
    connection.end();
  })
}


function chooseInventoryThreshold() {
  inquirer.prompt([
  {
    message: "What is your quantity threshold?",
    type: "input",
    name: "quantity_threshold",
    validate: isNumber
  }]).then(function(answer) {
    viewLowInventory(answer['quantity_threshold'])
  })
}


function viewLowInventory(n) {
  let sql = `
    SELECT p.item_id as 'ID',
      p.product_name as 'Product',
      d.department_name as 'Department',
      p.price as 'Price (USD)',
      p.stock_quantity as 'Stock'
    FROM products p
    JOIN departments d USING (department_id)
    WHERE p.stock_quantity <= ?
    ORDER BY stock_quantity`;

  connection.query(sql, [n], function(err, result) {
    if (err) throw err;

    console.log(Table.print(result))
    connection.end();
    logger.writeToLog("warn", `There are ${result.length} products whose stock has fallen to or beneath ${n} units`)
  })
}


function chooseProductUpdate() {
  inquirer.prompt([
  {
    message: "Which product Id would you like to edit?",
    name: "product_id",
    default: 1,
    validate: isNumber
  },
  {
    message: "How many items would you like to add?",
    name: "quantity",
    default: 1,
    validate: isNumber
  }]).then(function(answers) {
    addToInventory(
      parseInt(answers.product_id),
      parseInt(answers.quantity)
    );
  })

}


function addToInventory(id, quant) {
  let sql = `
    UPDATE products
    SET stock_quantity = stock_quantity + ?
    WHERE item_id = ?`;

  connection.query(sql, [quant, id], function(err, result) {
    if (err) throw err;

    console.log(`Added ${quant} new units to item ${id}`)
    logger.writeToLog("info", `Added ${quant} new units to item id ${id}`);
    connection.end();
  })

}


function chooseNewProduct() {
  inquirer.prompt([
  {
    message: "What is the product name",
    name: "product_name"
  },
  {
    message: "What is the product department?",
    name: "product_department"
  },
  {
    message: "What is the product price?",
    name: "product_price",
    validate: isNumber
  },
  {
    message: "How many units would you like to add?",
    name: "product_stock",
    validate: isNumber
  }]).then(function(answers) {
    addNewProduct(
      answers.product_name,
      answers.product_department,
      parseFloat(answers.product_price),
      parseInt(answers.product_stock)
    );
  })
}


function addNewProduct(product, department, price, stock) {
  // TODO: if department_id is null then print error -
  // can only create products in departments that exist
  department = department.toLowerCase();
  let check = `SELECT department_id FROM departments WHERE department_name = ?`;
  connection.query(check, [department], function(err, result) {
    if (err) throw err;

    if (result.length >= 1) {
      let sql = `
        INSERT INTO products
          (product_name, department_id, price, stock_quantity)
        VALUES (?, (SELECT department_id FROM departments WHERE department_name = ?), ?, ?)`;

      connection.query(sql, [product, department, price, stock], function(err, result) {
        if (err) throw err;

        console.log("Updated table!");
        logger.writeToLog("info", `Added product '${product}' in department '${department}' for a price of '${price}' with an initial stock of '${stock}'`);
        connection.end();
      })

    } else {
      console.log(`Department '${department}' does not exist! Please have a Supervisor create it first.`)
      logger.writeToLog("error", `Attempt to add product to department '${department}' failed. This department does not exist.`);
      connection.end();
    }
  })
}


function isNumber(val) {
  return !isNaN(parseFloat(val)) && isFinite(val)
}
