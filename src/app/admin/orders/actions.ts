"use server";

import { adminDb } from "@/lib/firebase-admin";
import { Order } from "@/lib/types";
import { sendShippingUpdateEmail } from "@/lib/email";


export async function getOrdersAction(status?: string) {
  try {
    const snapshot = await adminDb.collection("orders")
      .orderBy("createdAt", "desc")
      .get();
      
    let orders = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];

    if (status && status !== "all") {
      orders = orders.filter(o => o.status === status);
    }
    
    return { success: true, orders };
  } catch (err: any) {
    console.error("getOrdersAction error:", err);
    return { success: false, error: err.message };
  }
}

export async function updateOrderStatusAction(id: string, status: Order["status"]) {
  try {
    const orderRef = adminDb.collection("orders").doc(id);
    await orderRef.update({
      status,
      updatedAt: Date.now()
    });

    // If status is changed to shipped, send an email
    if (status === "shipped") {
      const orderSnap = await orderRef.get();
      if (orderSnap.exists) {
        const orderData = orderSnap.data();
        await sendShippingUpdateEmail({ id, ...orderData });
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("updateOrderStatusAction error:", err);
    return { success: false, error: err.message };
  }
}

export async function getOrderByIdAction(id: string) {
  try {
    const docSnap = await adminDb.collection("orders").doc(id).get();
    if (!docSnap.exists) {
      return { success: false, error: "Order not found" };
    }
    const order = { id: docSnap.id, ...docSnap.data() } as Order;
    return { success: true, order };
  } catch (err: any) {
    console.error("getOrderByIdAction error:", err);
    return { success: false, error: err.message };
  }
}
