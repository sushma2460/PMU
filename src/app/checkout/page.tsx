"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, CreditCard, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { StripeWrapper } from "@/components/checkout/StripeWrapper";
import { PaymentForm } from "@/components/checkout/PaymentForm";

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "USA",
    phone: ""
  });

  const subtotal = getCartTotal();
  const shippingAmount = subtotal > 150 ? 0 : 15;
  const taxAmount = subtotal * 0.08;
  const storeCreditUsed = 0; 
  const total = subtotal + shippingAmount + taxAmount - storeCreditUsed;
  const pointsEarned = Math.floor(subtotal);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Create Payment Intent on the server
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items, 
          userId: user?.uid 
        }),
      });

      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStep(2);
        window.scrollTo(0, 0);
      } else {
        toast.error("Unable to initialize secure payment. Please try again.");
      }
    } catch (err) {
      toast.error("Connection error. Please check your internet.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    setStep(3);
    clearCart();
    toast.success("Payment Received. Your PMU SUPPLY package is being prepared.");
  };

  if (items.length === 0 && step !== 3) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center max-w-xl">
          <h1 className="text-4xl font-heading mb-6 italic">Your cart is silent</h1>
          <p className="text-zinc-500 mb-10 font-light leading-relaxed">
            There are no products in your bag yet. Explore our curated collections to find your perfect setup.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-brand-black text-white hover:bg-brand-gold px-12 h-14 rounded-none font-bold tracking-[0.2em] uppercase transition-all duration-500">
              Return to Catalog
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream/30">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Main Checkout Section */}
          <div className="flex-1 space-y-12">
            
            {step === 3 ? (
              <div className="bg-white p-12 md:p-20 shadow-xl border border-brand-gold/10 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-brand-gold/10 flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-brand-gold" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-heading tracking-tight italic">Order Confirmed</h1>
                <p className="text-lg text-zinc-500 max-w-xl mx-auto font-light leading-relaxed">
                  Your order is being prepared with clinical care. You've earned <span className="text-brand-gold font-bold tracking-widest">{pointsEarned} PMU SUPPLY POINTS</span>.
                </p>
                <div className="pt-10">
                  <Link href="/products">
                    <Button size="lg" className="bg-brand-black text-white hover:bg-brand-gold px-12 h-14 rounded-none font-bold tracking-[0.2em] transition-all">
                      CONTINUE YOUR JOURNEY
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-6 mb-8 overflow-hidden">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-brand-black text-white' : 'bg-zinc-200'}`}>01</span>
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Shipment</span>
                  </div>
                  <div className="w-12 h-px bg-zinc-200" />
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-brand-black text-white' : 'bg-zinc-200'}`}>02</span>
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Review & Pay</span>
                  </div>
                </div>

                {step === 1 ? (
                  <form onSubmit={handleNext} className="bg-white p-8 md:p-12 shadow-sm border border-zinc-100 space-y-10">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-heading italic">Shipping Destination</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold tracking-widest uppercase opacity-60">First Name</Label>
                          <Input required value={formData.firstName} onChange={(e)=>setFormData({...formData, firstName: e.target.value})} className="h-12 rounded-none border-zinc-200 bg-zinc-50/30 focus:border-brand-gold" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold tracking-widest uppercase opacity-60">Last Name</Label>
                          <Input required value={formData.lastName} onChange={(e)=>setFormData({...formData, lastName: e.target.value})} className="h-12 rounded-none border-zinc-200 bg-zinc-50/30 focus:border-brand-gold" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest uppercase opacity-60">Email Address</Label>
                        <Input type="email" required value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="h-12 rounded-none border-zinc-200 bg-zinc-50/30 focus:border-brand-gold" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest uppercase opacity-60">Home/Studio Address</Label>
                        <Input required value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} className="h-12 rounded-none border-zinc-200 bg-zinc-50/30 focus:border-brand-gold" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-2">
                          <Label className="text-[10px] font-bold tracking-widest uppercase opacity-60">City</Label>
                          <Input required value={formData.city} onChange={(e)=>setFormData({...formData, city: e.target.value})} className="h-12 rounded-none border-zinc-200 bg-zinc-50/30 focus:border-brand-gold" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold tracking-widest uppercase opacity-60">Zip / Postal</Label>
                          <Input required value={formData.zipCode} onChange={(e)=>setFormData({...formData, zipCode: e.target.value})} className="h-12 rounded-none border-zinc-200 bg-zinc-50/30 focus:border-brand-gold" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-zinc-100 flex justify-between items-center">
                      <Link href="/products" className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 hover:text-brand-black transition-colors flex items-center">
                        <ArrowLeft className="w-3 h-3 mr-2" />
                        BACK TO SHOP
                      </Link>
                      <Button type="submit" size="lg" className="bg-brand-black text-white hover:bg-brand-gold px-10 h-14 rounded-none font-bold tracking-[0.2em] uppercase transition-all">
                        PROCEED TO REVIEW
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-white p-8 md:p-12 shadow-sm border border-zinc-100 space-y-12 animate-in slide-in-from-right duration-500">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-heading italic">Review & Payment</h2>
                      <div className="p-6 bg-brand-cream/20 border border-brand-gold/10 grid md:grid-cols-2 gap-8 relative overflow-hidden">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold tracking-widest text-brand-gold uppercase">Delivery Target</p>
                          <p className="text-sm font-light leading-relaxed">
                            {formData.firstName} {formData.lastName}<br/>
                            {formData.address}<br/>
                            {formData.city}, {formData.zipCode}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold tracking-widest text-brand-gold uppercase">Contact Details</p>
                          <p className="text-sm font-light">{formData.email}</p>
                          <button onClick={() => setStep(1)} className="text-[10px] font-bold tracking-widest hover:text-brand-gold transition-colors mt-2 uppercase border-b border-brand-black/10">Modify Info</button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                         <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-400">Payment Gateway</h3>
                         <div className="flex gap-2 grayscale opacity-40 scale-75">
                           <span className="text-[10px] font-bold">VISA • AMEX • PAYPAL</span>
                         </div>
                      </div>
                      <div className="p-8 border-2 border-brand-black flex items-center gap-6 bg-zinc-50/50">
                        <CreditCard className="w-10 h-10 text-brand-black" />
                        <div className="flex-1">
                          <p className="text-sm font-bold tracking-widest uppercase">Secure Professional Checkout</p>
                          <p className="text-[11px] font-light text-zinc-500 italic mt-1">Processed securely via Stripe Technology.</p>
                        </div>
                        <ShieldCheck className="text-brand-gold w-6 h-6" />
                      </div>
                    </div>

                    <div className="pt-10 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-8">
                      <button onClick={() => setStep(1)} className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 hover:text-brand-black transition-colors flex items-center uppercase">
                        <ArrowLeft className="w-3 h-3 mr-2" />
                        REVISE DETAILS
                      </button>
                    </div>

                    {clientSecret && (
                      <StripeWrapper clientSecret={clientSecret}>
                        <PaymentForm total={total} onSuccess={handlePaymentSuccess} />
                      </StripeWrapper>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Luxury Order Summary Sidebar */}
          <div className="w-full lg:w-[450px]">
            <div className="sticky top-24 space-y-6">
              <Card className="rounded-none border-brand-gold/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
                <CardHeader className="border-b bg-zinc-50/30 py-6">
                  <CardTitle className="text-xs uppercase tracking-[0.3em] font-bold text-center">Your Selection</CardTitle>
                </CardHeader>
                <CardContent className="py-8 space-y-8">
                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 no-scrollbar">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-6 animate-in slide-in-from-bottom duration-300">
                        <div className="relative w-20 h-24 bg-brand-cream/20 flex-shrink-0 group overflow-hidden">
                          <img src={item.product.imageUrls[0]} alt={item.product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                          <div className="absolute top-2 left-2 bg-brand-gold text-white text-[8px] font-bold px-2 py-0.5 tracking-widest uppercase">
                            x{item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 space-y-1 py-1">
                          <h4 className="text-xs font-bold tracking-wider leading-relaxed text-zinc-800 uppercase">{item.product.name}</h4>
                          <p className="text-[10px] font-light text-zinc-400 italic mb-2">{item.product.category}</p>
                          <p className="text-sm font-normal tracking-wider">${((item.product.salePrice ?? item.product.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-brand-gold/10 space-y-4 font-light text-sm">
                    <div className="flex justify-between tracking-widest uppercase text-[10px]">
                      <span className="text-zinc-400">Inventory Total</span>
                      <span className="font-bold text-zinc-800">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between tracking-widest uppercase text-[10px]">
                      <span className="text-zinc-400">Global Logistics</span>
                      <span className="font-bold text-zinc-800">{shippingAmount === 0 ? "Complimentary" : `$${shippingAmount.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between tracking-widest uppercase text-[10px]">
                      <span className="text-zinc-400">State Taxation</span>
                      <span className="font-bold text-zinc-800">${taxAmount.toFixed(2)}</span>
                    </div>
                    {storeCreditUsed > 0 && (
                      <div className="flex justify-between tracking-widest uppercase text-[10px] text-green-600">
                        <span>Store Credit Credit</span>
                        <span className="font-bold">-${storeCreditUsed.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="pt-6 border-t border-brand-black flex justify-between items-baseline">
                      <span className="text-[11px] font-bold tracking-[0.4em] uppercase">Total Due</span>
                      <span className="text-2xl font-heading font-normal">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <div className="bg-brand-black text-brand-gold py-4 text-center">
                  <p className="text-[9px] font-bold tracking-[0.5em] uppercase">★ Earn {pointsEarned} Anniversary Points ★</p>
                </div>
              </Card>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white border border-brand-gold/10 text-center space-y-3 shadow-lg">
                  <Truck className="mx-auto w-4 h-4 text-brand-gold opacity-60" />
                  <p className="text-[9px] font-bold uppercase tracking-widest leading-tight">Priority <br/>Shipping</p>
                </div>
                <div className="p-6 bg-white border border-brand-gold/10 text-center space-y-3 shadow-lg">
                  <ShieldCheck className="mx-auto w-4 h-4 text-brand-gold opacity-60" />
                  <p className="text-[9px] font-bold uppercase tracking-widest leading-tight">Secured <br/>Assets</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
