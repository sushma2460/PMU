import { NextResponse } from "next/server";
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

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[track-event] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
