import Razorpay from "razorpay";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not defined in environment variables");
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_missing",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "missing_secret",
});
