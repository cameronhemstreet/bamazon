// Initializes the npm packages used
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

// Creates the connection with the server and loads the product data upon a successful connection
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  itemLoad();
});

// Function to load the products table from the database and print results to the console
function itemLoad() {
  // Selects all of the data from the MySQL products table
  connection.query("SELECT * FROM bamazon.products", function(err, res) {
    if (err) throw err;

    // Draw the table in the terminal using the response
    console.table(res);

    // Then prompt the customer for their choice of product, pass all the products to productChoice
    productChoice(res);
  });
}

// Prompt the customer for a product ID
function productChoice(inventory) {
  // Prompts user for what they would like to purchase
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
      // Check if the user wants to quit the program
      checkIfQuit(val.choice);
      var choiceId = parseInt(val.choice);
      var product = stockCount(choiceId, inventory);

      // If there is a product with the id the user chose, prompt the customer for a desired quantity
      if (product) {
        // Pass the chosen product to quantityOfProducts
        quantityOfProducts(product);
      }
      else {
        // Otherwise let them know the item is not in the inventory, re-run itemLoad
        console.log("\nThat item is not currently available.");
        itemLoad();
      }
    });
}

// Prompt the customer for a product quantity
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
      // Check if the user wants to quit the program
      checkIfQuit(val.quantity);
      var quantity = parseInt(val.quantity);

      // If there isn't enough of the chosen product and quantity, let the user know and re-run itemLoad
      if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity! Please check the stock_quantity for current stock.");
        itemLoad();
      }
      else {
        // Otherwise run makePurchase, give it the product information and desired quantity to purchase
        makePurchase(product, quantity);
      }
    });
}

// Purchase the desired quantity of the desired item
function makePurchase(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id],
    function(err, res) {
      // Let the user know the purchase was successful, re-run itemLoad
      console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
      itemLoad();
    }
  );
}

// Check to see if the product the user chose exists in the inventory
function stockCount(choiceId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {
      // If a matching product is found, return the product
      return inventory[i];
    }
  }
  // Otherwise return null
  return null;
}

// Check to see if the user wants to quit the program
function checkIfQuit(choice) {
  if (choice.toLowerCase() === "q") {
    // Log a message and exit the current node process
    console.log("Goodbye, have a great day!");
    process.exit(0);
  }
}
