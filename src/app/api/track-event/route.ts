import { NextResponse } from "next/server";
import * as admin from "firebase-admin";
import { adminDb } from "@/lib/firebase-admin";

// Server-side event tracking — uses Admin SDK, bypasses Firestore client rules
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, userId, sessionId, timestamp, ...properties } = body;

    if (!event || typeof event !== "string") {
      return NextResponse.json({ error: "Missing event name" }, { status: 400 });
    }

    await adminDb.collection("analytics_events").add({
      event,
      userId:    userId    ?? "guest",
      sessionId: sessionId ?? "unknown",
      timestamp: timestamp ?? Date.now(),
      ...properties,
    });

    // Automatically increment product views if it's a product_view event
    if (event === "product_view" && properties.productId) {
      try {
        await adminDb.collection("products").doc(properties.productId).update({
          views: admin.firestore.FieldValue.increment(1)
        });
      } catch (e) {
        console.error("[track-event] failed to increment views:", e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[track-event] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
