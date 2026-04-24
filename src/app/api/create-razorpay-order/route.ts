import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { items, userId, couponCode, shippingAddress, pointsToUse } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Empty cart" }, { status: 400 });
    }

    // 1. Calculate Subtotal & Discount
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const productDoc = await adminDb.collection("products").doc(item.product.id).get();
      if (!productDoc.exists) continue;
      
      const productData = productDoc.data();
      let priceAtPurchase = productData?.salePrice ?? productData?.price;
      let variantName = "";
      
      if (item.variantId && productData?.variants) {
        const variant = productData.variants.find((v: any) => v.id === item.variantId);
        if (variant) {
          priceAtPurchase = variant.salePrice ?? variant.price;
          variantName = Object.values(variant.combination || {}).join(' / ');
        }
      }
      
      const itemTotal = priceAtPurchase * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.product.id,
        productName: item.product.name,
        variantId: item.variantId || null,
        variantName: variantName || null,
        quantity: item.quantity,
        priceAtPurchase: priceAtPurchase,
        totalPrice: itemTotal
      });
    }

    // 2. Handle Coupon & Points
    let couponDiscountAmount = 0;
    let pointsDiscountAmount = 0;
    let couponId = null;

    if (couponCode) {
      const couponSnapshot = await adminDb.collection("coupons")
        .where("code", "==", couponCode.toUpperCase())
        .limit(1)
        .get();

      if (!couponSnapshot.empty) {
        const couponData = couponSnapshot.docs[0].data();
        if (couponData.isActive && (!couponData.expiryDate || couponData.expiryDate > Date.now())) {
          couponId = couponSnapshot.docs[0].id;
          if (couponData.type === 'percentage') {
            couponDiscountAmount = subtotal * (couponData.value / 100);
          } else if (couponData.type === 'flat') {
            couponDiscountAmount = couponData.value;
          }
        }
      }
    }

    if (pointsToUse && pointsToUse > 0) {
      pointsDiscountAmount = pointsToUse / 100;
    }

    // 3. Shipping & Tax
    const discountTotal = couponDiscountAmount + pointsDiscountAmount;
    const finalSubtotal = Math.max(0, subtotal - discountTotal);
    const shipping = finalSubtotal > 12000 ? 0 : 150;
    const tax = finalSubtotal * 0.08;
    const total = Math.round((finalSubtotal + shipping + tax) * 100) / 100;

    // 4. Create Razorpay Order
    const amountInCents = Math.round(total * 100);
    const razorpayOptions = {
      amount: amountInCents,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: { userId: userId || "guest" }
    };

    const rzpOrder = await razorpay.orders.create(razorpayOptions);

    // 5. Save Pending Order to Firestore
    await adminDb.collection("orders").doc(rzpOrder.id).set({
      userId: userId || "guest",
      items: orderItems,
      subtotal: subtotal,
      discountAmount: discountTotal,
      couponDiscountAmount: couponDiscountAmount,
      pointsDiscountAmount: pointsDiscountAmount,
      shippingAmount: shipping,
      taxAmount: tax,
      total: total,
      couponId: couponId,
      couponCode: couponCode || null,
      pointsUsed: pointsToUse || 0,
      status: 'pending',
      shippingAddress: shippingAddress,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      razorpayOrderId: rzpOrder.id
    });

    return NextResponse.json({
      orderId: rzpOrder.id,
      amount: amountInCents,
      currency: "INR",
    });
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
