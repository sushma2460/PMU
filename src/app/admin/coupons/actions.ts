"use server";

import { adminDb } from "@/lib/firebase-admin";

export async function createCouponAction(data: any) {
  try {
    const docData = {
      ...data,
      usageCount: 0,
      isActive: true,
      createdAt: Date.now()
    };
    
    const docRef = await adminDb.collection("coupons").add(docData);
    return { success: true, id: docRef.id };
  } catch (err: any) {
    console.error("Server Action Error (createCoupon):", err);
    return { success: false, error: err.message || "Failed to create coupon" };
  }
}

export async function updateCouponAction(id: string, data: any) {
  try {
    const docData = { ...data };
    if (docData.id) delete docData.id;
    await adminDb.collection("coupons").doc(id).update(docData);
    return { success: true };
  } catch (err: any) {
    console.error("Server Action Error (updateCoupon):", err);
    return { success: false, error: err.message || "Failed to update coupon" };
  }
}

export async function getCouponsAction() {
  try {
    const snapshot = await adminDb.collection("coupons").get();
    const coupons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, coupons };
  } catch (err: any) {
    console.error("Server Action Error (getCoupons):", err);
    return { success: false, error: err.message || "Failed to fetch coupons" };
  }
}

export async function deleteCouponAction(id: string) {
  try {
    await adminDb.collection("coupons").doc(id).delete();
    return { success: true };
  } catch (err: any) {
    console.error("Server Action Error (deleteCoupon):", err);
    return { success: false, error: err.message || "Failed to delete coupon" };
  }
}
