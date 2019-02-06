var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",


    port: 3306,


    user: "root",

    password: "Magessa@87",
    database: "bamazon_db"
});

var buyItem = function () {
    connection.query('SELECT * FROM products', function (err, res) {


        console.log("==============Items=For=Sell===============");
        console.log("====ID===========Item============Price=====");
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {

            console.log(" | " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + "");

        }
        inquirer.prompt([{
            name: "itemId",
            type: "input",
            message: "What is the item ID you would like to buy?",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            name: "Quantity",
            type: "input",
            message: "How many of this item would you like to buy?",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }]).then(function (answer) {
            var chosenId = answer.itemId - 1
            var chosenQuantity = answer.Quantity
            if (chosenQuantity < res[chosenId].stock) {
                console.log("Your total for " + "(" + answer.Quantity + ")" + " - " + res[chosenId].product_name + " is: $" + res[chosenId].price * chosenQuantity);
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock: res[chosenId].stock - chosenQuantity
                }, {
                    item_id: res[chosenId].item_id
                }], function (err, res) {

                    buyItem();
                });

            } else {
                console.log("Sorry, insufficient stock at this time. All we have is " + res[chosenId].stock + " in stock.");
                buyItem();
            }
        })
    })
}


buyItem();