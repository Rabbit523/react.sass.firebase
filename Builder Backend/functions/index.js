const functions = require('firebase-functions');
const express = require("express");
const app = express();
const stripe = require("stripe")("sk_test_xDJVwmpxzw56PDzW8XT36juw00QqaGw9Iw");
const cors = require("cors");

app.use(cors({origin: true}));
app.use(require("body-parser").json());

app.get("/", (req, res) => {
  console.log("Hello world");
  res.json("Test is succed");
});

app.post("/test", (req, res) => {
  res.json("Test is succed");
});

app.post("/charge", async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      name: req.body.name,
      email: req.body.email,
      source: req.body.token
    });
    console.log('customer.id = ', customer.id);
    const charge = await stripe.charges.create({
      amount: req.body.amount,
      currency: "usd",
      customer: customer.id
    });
    console.log('charge created');
    res.json(charge);
  } catch (err) {
    console.warn(err);
    res.json(`charge error: ${err.statusText}`);
  }
});

exports.app = functions.https.onRequest(app);