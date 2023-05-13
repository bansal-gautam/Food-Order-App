require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Successfully Connected To Database");
  })
  .catch((err) => console.log(err));

const mealSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.Mixed, // Allow embedding object without a specific schema
  },
  products: {
    type: [ProductSchema],
    required: true,
  },
});

const Order = mongoose.model("Order", OrderSchema);

const Meal = mongoose.model("Meal", mealSchema);

const getMeals = async () => {
  const meals = await Meal.find();
  return meals;
};

const deleteMeals = async () => {
  await Meal.deleteMany();
};

const getOrders = async () => {
  const orders = await Order.find();
  return orders;
};

const deleteOrders = async () => {
  await Order.deleteMany();
};

// app.get("/", (req, res) => {
//   res.sendFile("index.html");
// });

app
  .route("/meals")
  .get((req, res) => {
    getMeals()
      .then((foundMeals) => {
        res.send(foundMeals);
      })
      .catch((err) => res.send(err));
  })
  .post((req, res) => {
    const newMeal = new Meal({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    });
    newMeal
      .save()
      .then(() => res.send("Successfully Added New Meal"))
      .catch((err) => res.send(err));
  })
  .delete((req, res) => {
    deleteMeals()
      .then(() => res.send("Successfully Deleted"))
      .catch((err) => res.send(err));
  });

app
  .route("/order")
  .get((req, res) => {
    getOrders()
      .then((foundOrders) => res.send(foundOrders))
      .catch((err) => res.send(err));
  })
  .post((req, res) => {
    const orderData = req.body;
    const newOrder = new Order(orderData);
    newOrder
      .save()
      .then(() => res.send("Successfully Ordered"))
      .catch((err) => res.send(err));
  })
  .delete((req, res) => {
    deleteOrders()
      .then(() => res.send("Successfully Deleted"))
      .catch((err) => res.send(err));
  });

app.listen(process.env.PORT || 5000, () => {
  console.log("App Listening on port " + process.env.PORT);
});
