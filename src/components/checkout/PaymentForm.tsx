"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function PaymentForm({ 
  total,
  onSuccess 
}: { 
  total: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL for success
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required' // If not using credit card, we handle redirect manually
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        toast.error(error.message as string);
        setMessage(error.message as string);
      } else {
        toast.error("An unexpected error occurred.");
        setMessage("An unexpected error occurred.");
      }
    } else {
      // Payment succeeded!
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-8">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      
      <div className="pt-6">
        <Button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className="w-full h-16 bg-brand-black text-white hover:bg-brand-gold rounded-none font-bold tracking-[0.3em] uppercase transition-all duration-500 shadow-2xl shadow-brand-gold/10"
        >
          <span id="button-text">
            {isLoading ? "Validating Transaction..." : `AUTHORIZE PAYMENT — $${total.toFixed(2)}`}
          </span>
        </Button>
      </div>

      {/* Show any error or success messages */}
      {message && <div id="payment-message" className="text-red-500 text-[10px] uppercase tracking-widest text-center font-bold">{message}</div>}
    </form>
  );
}
