const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Define Things

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

// Mongoose

mongoose.connect(process.env.Mongoose_DB, { useNewUrlParser: true });

const userSchema = {
  name: String,
  email: String,
  amount: Number,
};

const userTransactionSchema = {
  sender: String,
  receiver: String,
  amount: Number,
};

const User = new mongoose.model("User", userSchema);
const UserTransaction = new mongoose.model(
  "UserTransaction",
  userTransactionSchema
);

// Default Users

const user1 = new User({
  name: "John",
  email: "john@gmail.com",
  amount: 10000,
});

const user2 = new User({
  name: "Ram",
  email: "ram@gmail.com",
  amount: 20000,
});

const user3 = new User({
  name: "Rajesh",
  email: "rajesh@gmail.com",
  amount: 30000,
});

const user4 = new User({
  name: "Alexa",
  email: "alexa@gmail.com",
  amount: 40000,
});

const user5 = new User({
  name: "Siri",
  email: "siri@gmail.com",
  amount: 50000,
});

const user6 = new User({
  name: "Krishna",
  email: "krishna@gmail.com",
  amount: 60000,
});

const userTrans = [];

const defaultUser = [user1, user2, user3, user4, user5, user6];

// App Start

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/transaction", function (req, res) {
  User.find({}, function (err, users) {
    if (users.length === 0) {
      User.insertMany(defaultUser, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Inserted All");
        }
        res.redirect("transaction");
      });
    } else {
      UserTransaction.find({}, function (err, trans) {
        if (!err) {
          console.log("Hello");
          res.render("transaction", { usersDetail: trans });
        }
      });
    }
  });
});

app.get("/customer", function (req, res) {
  User.find({}, function (err, users) {
    if (users.length === 0) {
      User.insertMany(defaultUser, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Inserted All");
        }
        res.redirect("customer");
      });
    } else {
      res.render("customer", { usersDetail: users });
    }
  });
});

app.post("/customer", function (req, res) {
  let senderName = req.body.senderName;
  let recevierName = req.body.recevierName;
  let price = Number(req.body.price);

  User.find(
    { $and: [{ name: { $in: [senderName, recevierName] } }] },
    function (err, foundList) {
      if (!foundList) {
        console.log("Not Found!!");

        res.redirect("/customer");
      } else {
        if (foundList.length > 1) {
          const user = {
            sender: senderName,
            receiver: recevierName,
            amount: price,
          };

          if (price >= foundList[0].amount) {
            res.redirect("/customer");
          } else {
            userTrans.push(user);

            User.findOneAndUpdate(
              { name: senderName },
              {
                $inc: { amount: -price },
              },
              {
                returnNewDocument: false,
              },
              function (err, result) {
                if (!err) {
                  console.log(result);
                }
              }
            );

            User.findOneAndUpdate(
              { name: recevierName },
              {
                $inc: { amount: price },
              },
              {
                returnNewDocument: false,
              },
              function (err, result) {
                if (!err) {
                  console.log(result);
                }
              }
            );

            UserTransaction.create(user, function (err) {
              if (!err) {
                console.log("Insert Value");
              } else {
                console.log(err);
              }
            });

            res.redirect("/transaction");
          }
        } else {
          res.redirect("/customer");
          console.log("Not Founds!!");
        }
      }
    }
  );

  console.log(senderName, recevierName, price);
});

app.get("/transfer", function (req, res) {
  res.render("transfer");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started at port 3000.");
});
