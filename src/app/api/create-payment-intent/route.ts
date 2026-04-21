import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { items, userId } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Empty cart" }, { status: 400 });
    }

    // Server-side price calculation to prevent tampering
    let totalAmount = 0;
    
    for (const item of items) {
      const productDoc = await adminDb.collection("products").doc(item.product.id).get();
      if (!productDoc.exists) continue;
      
      const productData = productDoc.data();
      const basePrice = productData?.salePrice ?? productData?.price;
      
      // Handle variant price adjustment if applicable
      let variantPriceAdjustment = 0;
      if (item.variantId && productData?.variants) {
        const variant = productData.variants.find((v: any) => v.id === item.variantId);
        if (variant) {
          variantPriceAdjustment = variant.priceModifier || 0;
        }
      }
      
      totalAmount += (basePrice + variantPriceAdjustment) * item.quantity;
    }

    // Add shipping if under $150
    const shipping = totalAmount > 150 ? 0 : 15;
    totalAmount += shipping;
    
    // Add estimated 8% tax
    const tax = totalAmount * 0.08;
    totalAmount += tax;

    // Convert to cents for Stripe
    const amountInCents = Math.round(totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: userId || "guest",
        items: JSON.stringify(items.map((i: any) => ({ 
          id: i.product.id, 
          v: i.variantId || 'base',
          q: i.quantity 
        }))),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
