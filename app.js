const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

// Define Things

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

// Mongoose

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = ({
  name: String,
  email: String,
  amount: Number,
});

const userTransactionSchema = ({
    sender : String,
    Receiver : String,
    amount : Number
});

const User = new mongoose.model("User", userSchema);
const UserTransaction = new mongoose.model("UserTransaction", userTransactionSchema);

// Default Users

const user1 = new User({
  name: "John",
  email: "johnc@gmail.com",
  amount: 10000,
});

const user2 = new User({
  name: "Ram",
  email: "ramj@gmail.com",
  amount: 20000,
});

const user3 = new User({
  name: "Rajesh",
  email: "rajeshd@gmail.com",
  amount: 30000,
});

const user4 = new User({
  name: "Alexa",
  email: "alexag@gmail.com",
  amount: 40000,
});

const user5 = new User({
  name: "Siri",
  email: "siria@gmail.com",
  amount: 50000,
});

const user6 = new User({
  name: "Krishna",
  email: "krishnag@gmail.com",
  amount: 60000,
});

const defaultUser = [user1, user2, user3, user4, user5, user6];

// User.insertMany(defaultUser, function(err){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("Inserted All");
//     }
// });

// App Start

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/transaction", function (req, res) {
  User.find({}, function (err, users) {
    if(users.length === 0){
        User.insertMany(defaultUser, function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Inserted All");
            }
            res.redirect("transaction");
        });
    }else{
        res.render("transaction", { usersDetail: users });
    }
  });
});

app.get("/customer", function (req, res) {
    User.find({}, function (err, users) {
        if(users.length === 0){
            User.insertMany(defaultUser, function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Inserted All");
                }
                res.redirect("customer");
            });
        }else{
            res.render("customer", { usersDetail : users });
        }
      });
});

app.get("/transfer", function(req,res){
  res.render("transfer");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started at port 3000.");
});
