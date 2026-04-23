import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isMatch = expectedSignature === razorpay_signature;

    if (isMatch) {
      // Update order status in Firestore
      
      const orderRef = adminDb.collection("orders").doc(razorpay_order_id);
      const orderSnap = await orderRef.get();
      const orderData = orderSnap.data();

      if (orderData && orderData.status !== 'paid') {
        const userId = orderData.userId;
        
        const userRef = adminDb.collection("users").doc(userId);
        
        // Mark user as having ordered before to prevent duplicate referral rewards
        await userRef.update({ hasOrderedBefore: true });

        // Update order
        await orderRef.update({
          status: 'paid',
          razorpayPaymentId: razorpay_payment_id,
          updatedAt: Date.now()
        });
      }

      return NextResponse.json({ verified: true });
    } else {
      return NextResponse.json({ verified: false }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
