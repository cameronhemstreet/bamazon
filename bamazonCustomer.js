var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  port: 8889,

  user: "root",

  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  itemLoad();
});

function itemLoad() {
  connection.query("SELECT * FROM bamazon.products", function(err, res) {
    if (err) throw err;

    console.table(res);

    productChoice(res);
  });
}

function productChoice(inventory) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "What is item_ID would you like to purchase (1-10)? [Quit with Q]",
        validate: function(val) {
          return !isNaN(val) || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      checkIfQuit(val.choice);
      var choiceId = parseInt(val.choice);
      var product = stockCount(choiceId, inventory);

      if (product) {
        quantityOfProducts(product);
      }
      else {
        console.log("\nThat item is not currently available.");
        itemLoad();
      }
    });
}

function quantityOfProducts(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like? [Quit with Q]",
        validate: function(val) {
          return val > 0 || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      checkIfQuit(val.quantity);
      var quantity = parseInt(val.quantity);

      if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity! Please check the stock_quantity for current stock.");
        itemLoad();
      }
      else {
        makePurchase(product, quantity);
      }
    });
}

function makePurchase(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id],
    function(err, res) {
      console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
      itemLoad();
    }
  );
}

function stockCount(choiceId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {
      return inventory[i];
    }
  }
  return null;
}

function checkIfQuit(choice) {
  if (choice.toLowerCase() === "q") {
    console.log("Goodbye, have a great day!");
    process.exit(0);
  }
}
