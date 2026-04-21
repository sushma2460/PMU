import { adminDb } from "../src/lib/firebase-admin";

async function updateShopSettings() {
  console.log("Updating Shop All settings to high-fidelity defaults...");
  
  const settingsRef = adminDb.collection("siteSettings").doc("shopAll");
  
  await settingsRef.set({
    grid: {
      desktop: 4,
      tablet: 2,
      mobile: 2,
      gap: 24
    },
    card: {
      aspectRatio: 'square',
      imageFit: 'cover',
      textAlignment: 'left',
      showBadge: true,
      titleSize: 'xs',
      priceSize: 'sm',
      padding: 0,
      borderRadius: 0
    }
  }, { merge: true });

  console.log("Success! Database updated to full-bleed 'Fit Mode'.");
}

updateShopSettings().catch(console.error);
