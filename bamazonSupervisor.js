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

inquirer.prompt([
  {
    message: "What would you like to do?",
    type: "list",
    name: "option",
    choices: [
      "View Product Sales by Department",
      "Create New Department"
    ]
  }
]).then(function(answers) {

  switch(answers.option) {
    case "View Product Sales by Department":
      salesByDepartment();
      break;

    case "Create New Department":
      inquirer.prompt([
        {
          message: "New Department Name:",
          name: "department_name"
        },
        {
          message: "Monthly over head costs:",
          name: "overhead"
        }
      ])
      .then(function(answers) {
        addNewDepartment(
          answers['department_name'],
          parseFloat(answers['overhead'])
        );
      })
      break;
  }
})


function salesByDepartment() {
  let sql = `
    SELECT d.department_id as 'ID',
      d.department_name as 'Department',
      d.over_head_costs as 'Overhead',
      SUM(p.product_sales) as 'Sales',
      SUM(p.product_sales) - d.over_head_costs as 'Profit'
    FROM departments d
    JOIN products p
    USING (department_id)
    GROUP BY d.department_name,
      d.over_head_costs,
      d.department_id
    ORDER BY d.department_id`

  connection.query(sql, function(err, result) {
    if (err) throw err;

    console.log(Table.print(result));
    logger.writeToLog('info', 'A Supervisor has viewed sales by department.');
  })

  connection.end();

}


function addNewDepartment(name, overhead) {
  name = name.toLowerCase();
  let sql = `INSERT INTO departments (department_name, over_head_costs)
    VALUES (?, ?)`

  connection.query(sql, [name, overhead], function(err, result) {
    if (err) throw err;

    let msg = `New department '${name}' added to departments table.`;
    console.log(msg);
    logger.writeToLog('info', msg);
  })

  connection.end();
}
