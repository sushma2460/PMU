import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  setDoc, 
  doc, 
  query, 
  where, 
  limit, 
  orderBy,
  onSnapshot,
  Timestamp,
  updateDoc,
  increment,
  writeBatch
} from "firebase/firestore";
import { Product, Order, Coupon, UserProfile, Referral } from "@/lib/types";

// --- INVENTORY SERVICE ---

export const getProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const updateProductStock = async (productId: string, newStock: number) => {
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, { stock: newStock, updatedAt: Date.now() });
};

// --- ORDER SERVICE ---

export const getOrders = async (status?: string): Promise<Order[]> => {
  const ordersRef = collection(db, "orders");
  const q = status 
    ? query(ordersRef, where("status", "==", status), orderBy("createdAt", "desc"))
    : query(ordersRef, orderBy("createdAt", "desc"));
    
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, { status, updatedAt: Date.now() });
};

// --- MARKETING SERVICE ---

export const getCoupons = async (): Promise<Coupon[]> => {
  const querySnapshot = await getDocs(collection(db, "coupons"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon));
};

export const createCoupon = async (couponData: Partial<Coupon>) => {
  return await addDoc(collection(db, "coupons"), {
    ...couponData,
    usageCount: 0,
    isActive: true
  });
};

// --- USER SERVICE ---

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
};

export const adjustUserPoints = async (userId: string, pointsDelta: number) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { 
    points: increment(pointsDelta)
  });
};

// --- DASHBOARD SERVICE ---

export const getDashboardStats = async () => {
  const orders = await getOrders();
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  
  // Actually usually you'd use a server-side aggregation for performance, 
  // but for MVP this works.
  
  return {
    totalRevenue,
    totalOrders,
    recentOrders: orders.slice(0, 5)
  };
};

// --- SEED UTILITY ---

export const seedDatabase = async () => {
  console.log("Starting Database Seed...");
  
  const PRODUCTS = [
    { name: "PMU SUPPLY Gentle Cleansing Scrub Gel (Before service)", price: 19.00, category: "Aftercare", imageUrls: ["https://images.unsplash.com/photo-1556228578-8d91b1a4d530?auto=format&fit=crop&q=80"] },
    { name: '"Nov" Mosha Original Practice Latex with Eyes', price: 8.00, category: "Practice Materials", imageUrls: ["https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80"] },
    { name: "Signature Practice Skins by Mosha Studio", price: 6.50, category: "Practice Materials", imageUrls: ["https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80"] },
    { name: "Ambition Tattoo Machine", price: 155.00, category: "Machines & Power Supplies", imageUrls: ["https://images.unsplash.com/photo-1611558709798-e009c8fd7706?auto=format&fit=crop&q=80"] },
    { name: "Aurora Power Supply", price: 49.00, category: "Machines & Power Supplies", imageUrls: ["https://images.unsplash.com/photo-1588613437303-9d8a5538c8be?auto=format&fit=crop&q=80"] },
    { name: "Nano Precision Needles Box", price: 45.00, category: "Needles", imageUrls: ["https://images.unsplash.com/photo-1611558709798-e009c8fd7706?auto=format&fit=crop&q=80"] },
  ];

  const batch = writeBatch(db);
  
  for (const p of PRODUCTS) {
    const pRef = doc(collection(db, "products"));
    batch.set(pRef, {
      ...p,
      slug: p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      description: "Professional grade PMU equipment for elite artists.",
      stock: 50,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isActive: true
    });
  }

  await batch.commit();
  console.log("Database Seeded Successfully!");
};
