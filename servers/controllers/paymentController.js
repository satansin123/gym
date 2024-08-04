const Razorpay = require("razorpay");
const crypto = require("crypto");

const makePayment = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100,
      currecny: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.error(error);
        return res.status(500).send("something went wrong");
      }
      res.status(200).send(order);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Payment failed");
  }
};

const handleVerifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).send("Payment verified successfully");
    } else {
      return res.status(400).send("Invalid signature sent!");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Payment Failed");
  }
};

module.exports = { makePayment, handleVerifyPayment };
