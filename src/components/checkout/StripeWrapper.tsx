"use client";

import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";

// Placeholder key - user needs to replace this in .env.local
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

export function StripeWrapper({ 
  children, 
  clientSecret 
}: { 
  children: React.ReactNode;
  clientSecret: string;
}) {
  const options = {
    clientSecret,
    appearance: {
      theme: 'bubblegum' as any, // 'stripe' or 'night' or 'bubblegum' (suits cosmetics)
      variables: {
        colorPrimary: '#C9A84C', // PMU SUPPLY Gold
        colorBackground: '#ffffff',
        colorText: '#0A0A0A',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '0px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
