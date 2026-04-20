export type ProductCategory = 
  | "Machines & Power Supplies"
  | "Needles"
  | "Pigments"
  | "Practice Materials"
  | "Aftercare"
  | "Anesthetic/Numbing"
  | "Shaping Tools"
  | "Lashes"
  | "Other";

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  sku?: string;
  category: ProductCategory | string;
  stock: number;
  imageUrls: string[];
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'customer';
  points: number;
  referralCode: string;
  referredBy?: string; // UID or referral code of the person who referred them
  createdAt: number;
}

export interface Category {
  id?: string;
  name: string;
  description?: string;
  slug: string;
}

export interface Coupon {
  id?: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number; // e.g., 10 for 10% or 10 for $10
  expiryDate: number;
  usageLimit: number;
  usageCount: number;
  minimumOrderValue?: number;
  isActive: boolean;
}

export interface Order {
  id?: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  couponApplied?: string;
  pointsEarned: number;
  pointsUsed: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: number;
}
