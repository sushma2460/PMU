import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { code, cartTotal, userId } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const couponSnapshot = await adminDb.collection("coupons")
      .where("code", "==", code.toUpperCase())
      .where("isActive", "==", true)
      .limit(1)
      .get();

    if (couponSnapshot.empty) {
      return NextResponse.json({ error: "Invalid or inactive coupon code" }, { status: 404 });
    }

    const couponData = couponSnapshot.docs[0].data();
    const couponId = couponSnapshot.docs[0].id;

    // 1. Check Expiry
    if (couponData.expiryDate && couponData.expiryDate < Date.now()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    // 2. Check Usage Limit
    if (couponData.usageLimit && couponData.usageCount >= couponData.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    // 3. Check Minimum Order Value
    if (couponData.minimumOrderValue && cartTotal < couponData.minimumOrderValue) {
      return NextResponse.json({ 
        error: `Minimum order of $${couponData.minimumOrderValue} required for this coupon` 
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: couponId,
        code: couponData.code,
        type: couponData.type,
        value: couponData.value,
        description: couponData.description
      }
    });

  } catch (error: any) {
    console.error("Coupon Validation Error:", error);
    return NextResponse.json({ error: "Internal server error during validation" }, { status: 500 });
  }
}
