// load dependencies
const dotenv = require("dotenv")
dotenv.config({debug: true})

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// configure variables from environments variables
const port = process.env.PORT || 8080;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeChargeDescription = process.env.STRIPE_CHARGE_DESCRIPTION;

// initialize express and stripe
const app = express();
const stripe = require("stripe")(stripeSecretKey);

// configure our middleware
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

// charge endpoint
app.post("/charge", async function(req, res) {
  const { id, amount } = req.body;

  try {
    let { status } = await stripe.charges.create({
      amount: amount * 100, // *100 because we sent dollar amount
      currency: "usd",
      description: stripeChargeDescription,
      source: id
    });

    res.json({ status });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

// listen on port
app.listen(port, function() {
  console.log("Listening on port: " + port);
});
