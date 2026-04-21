"use server";

import { adminDb } from "@/lib/firebase-admin";

export async function createProductAction(data: any) {
  try {
    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const now = Date.now();
    const docData = {
      name: data.name.trim(),
      slug,
      description: data.description.trim(),
      price: parseFloat(data.price) || 0,
      salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
      sku: data.sku.trim() || null,
      category: data.category,
      stock: parseInt(data.stock, 10) || 0,
      imageUrls: data.imageUrls || [],
      isActive: true,
      isFeatured: false,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection("products").add(docData);
    return { success: true, id: docRef.id };
  } catch (err: any) {
    console.error("Server Action Error (createProduct):", err);
    return { success: false, error: err.message || "Failed to create product" };
  }
}

export async function getProductsAction() {
  try {
    const snapshot = await adminDb.collection("products").orderBy("createdAt", "desc").get();
    const products = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });
    return { success: true, products };
  } catch (err: any) {
    console.error("Server Action Error (getProducts):", err);
    return { success: false, error: err.message || "Failed to fetch products" };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await adminDb.collection("products").doc(id).delete();
    return { success: true };
  } catch (err: any) {
    console.error("Server Action Error (deleteProduct):", err);
    return { success: false, error: err.message || "Failed to delete product" };
  }
}
