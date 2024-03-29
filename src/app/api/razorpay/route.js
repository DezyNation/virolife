const Razorpay = require("razorpay");
const shortid = require("shortid");

export async function POST(req, res) {
  // Initialize razorpay object
  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  // Create an order -> generate the OrderID -> Send it to the Front-end
  const payment_capture = 1;
  const body = await req.json();
  const { amount } = body;
  const currency = "INR";
  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    return new Response(
      JSON.stringify({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return new Response(err, { status: 500 });
  }
}
