import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

// ── Session ID ─────────────────────────────────────────────
const SESSION_KEY = "pmu_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

// ── Core event writer ──────────────────────────────────────
export async function trackEvent(
  event: string,
  userId: string = "guest",
  properties: Record<string, any> = {}
): Promise<void> {
  try {
    await addDoc(collection(db, "analytics_events"), {
      event,
      userId,
      sessionId: getSessionId(),
      timestamp: Date.now(),
      ...properties,
    });
  } catch {
    // Analytics must NEVER break the user experience
  }
}

// ── Typed event helpers ────────────────────────────────────

export function trackProductView(
  userId: string = "guest",
  product: { id?: string; name: string; category: string; price: number }
) {
  return trackEvent("product_view", userId, {
    productId: product.id ?? "",
    productName: product.name,
    category: product.category,
    price: product.price,
  });
}

export function trackAddToCart(
  userId: string = "guest",
  product: { id?: string; name: string; category: string },
  quantity: number,
  value: number
) {
  return trackEvent("add_to_cart", userId, {
    productId: product.id ?? "",
    productName: product.name,
    category: product.category,
    quantity,
    value,
  });
}

export function trackCheckoutStart(
  userId: string = "guest",
  payload: { itemCount: number; subtotal: number; hasCoupon: boolean }
) {
  return trackEvent("checkout_start", userId, payload);
}

export function trackCheckoutComplete(
  userId: string = "guest",
  payload: { orderId: string; total: number; itemCount: number; couponCode?: string }
) {
  return trackEvent("checkout_complete", userId, payload);
}
