"use client";

import { useState } from "react";
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  CreditCard, 
  Truck, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  ChevronRight,
  Package,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import jsPDF from "jspdf";

// Single Order Mock Data
const ORDER = {
  id: "PMU-8902",
  date: "October 31, 2026, 03:42 PM",
  status: "Pending",
  customer: {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    role: "Verified Artist",
    memberSince: "Jan 2024"
  },
  shippingAddress: "123 Beauty Lane, Suite 400, Los Angeles, CA 90001, United States",
  billingAddress: "Same as shipping",
  payment: {
    method: "Stripe",
    id: "pi_3M2h...9s2K",
    status: "Captured (Authorized)"
  },
  items: [
    { id: "1", name: "V3 Nano Cartridge 0.30mm", variant: "Box of 20", price: 45.00, quantity: 2, total: 90.00, image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80" },
    { id: "2", name: "Booms Butter — Tropical 50ml", variant: "Original", price: 24.95, quantity: 1, total: 24.95, image: "https://images.unsplash.com/photo-1556228578-8d91b1a4d530?auto=format&fit=crop&q=80" },
    { id: "3", name: "M90 Organic Black Pigment", variant: "15ml", price: 120.00, quantity: 1, total: 120.00, image: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80" }
  ],
  summary: {
    subtotal: 234.95,
    shipping: 15.00,
    tax: 18.82,
    total: 268.77,
    pointsUsed: 500,
    discountAmount: 50.00
  },
  timeline: [
    { event: "Order placed", time: "Oct 31, 03:42 PM", details: "Customer initiated purchase", current: true },
    { event: "Payment Authorized", time: "Oct 31, 03:43 PM", details: "Transaction pi_3M2h captured successfully", current: false },
  ]
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState(ORDER.status);

  const generateInvoice = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("PMU SUPPLY USA", 20, 20);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice for ${ORDER.id}`, 20, 30);
    doc.text(`Customer: ${ORDER.customer.name}`, 20, 40);
    doc.text(`Date: ${ORDER.date}`, 20, 50);
    doc.line(20, 55, 190, 55);
    
    let y = 65;
    ORDER.items.forEach(item => {
      doc.text(`${item.name} x ${item.quantity}`, 20, y);
      doc.text(`$${item.total.toFixed(2)}`, 160, y);
      y += 10;
    });
    
    doc.line(20, y, 190, y);
    doc.text(`Total Paid: $${ORDER.summary.total.toFixed(2)}`, 140, y + 10);
    
    doc.save(`Invoice_${ORDER.id}.pdf`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-4">
          <Link href="/admin/orders" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-brand-gold transition-colors tracking-widest uppercase">
            <ArrowLeft className="w-3 h-3" /> Back to Orders
          </Link>
          <div className="space-y-2">
             <div className="flex items-center gap-3">
               <h1 className="text-3xl font-heading font-normal">{params.id}</h1>
               <Badge className="bg-amber-50 text-amber-600 border-amber-100 rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-tighter">
                  {status}
               </Badge>
             </div>
             <p className="text-xs text-zinc-400 font-light italic">Placed on {ORDER.date}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={generateInvoice} className="rounded-full text-[10px] font-bold tracking-widest uppercase gap-2">
            <Download className="w-3 h-3" /> Generate PDF
          </Button>
          <Button variant="outline" className="rounded-full text-[10px] font-bold tracking-widest uppercase gap-2">
            <Printer className="w-3 h-3" /> Print Invoice
          </Button>
          <Button className="bg-zinc-900 hover:bg-black text-white rounded-full text-[10px] font-bold tracking-widest uppercase px-8">
            Ship Pack
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <Card className="rounded-[2.5rem] border-zinc-100 shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-zinc-50 bg-zinc-50/30">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-800">Purchased Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-50">
                {ORDER.items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 p-8 group">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain transition-transform group-hover:scale-110" />
                    </div>
                    <div className="flex-1 text-center sm:text-left space-y-1">
                       <h4 className="text-sm font-bold text-zinc-900">{item.name}</h4>
                       <p className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">{item.variant}</p>
                    </div>
                    <div className="flex items-center gap-8 text-right">
                       <div className="space-y-1 text-center">
                          <p className="text-[10px] text-zinc-400 uppercase font-black">Price</p>
                          <p className="text-xs font-bold text-zinc-900">${item.price.toFixed(2)}</p>
                       </div>
                       <div className="space-y-1 text-center">
                          <p className="text-[10px] text-zinc-400 uppercase font-black">Qty</p>
                          <p className="text-xs font-bold text-zinc-900">{item.quantity}</p>
                       </div>
                       <div className="space-y-1 text-right">
                          <p className="text-[10px] text-zinc-400 uppercase font-black">Total</p>
                          <p className="text-xs font-black text-brand-gold">${item.total.toFixed(2)}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-zinc-50/50 p-10 flex flex-col items-end space-y-3">
                 <div className="flex justify-between w-64 text-xs">
                    <span className="text-zinc-400 font-medium tracking-wide uppercase">Subtotal</span>
                    <span className="font-bold text-zinc-900">${ORDER.summary.subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between w-64 text-xs">
                    <span className="text-zinc-400 font-medium tracking-wide uppercase">Coupon (SAVE50)</span>
                    <span className="font-bold text-green-500">-${ORDER.summary.discountAmount.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between w-64 text-xs">
                    <span className="text-zinc-400 font-medium tracking-wide uppercase">Shipping (EMS)</span>
                    <span className="font-bold text-zinc-900">${ORDER.summary.shipping.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between w-64 pt-4 border-t border-zinc-200 text-lg">
                    <span className="font-heading tracking-wider uppercase text-zinc-800">Total Price</span>
                    <span className="font-black text-brand-black">${ORDER.summary.total.toFixed(2)}</span>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Feed */}
          <Card className="rounded-[2.5rem] border-zinc-100 shadow-sm overflow-hidden bg-white">
             <CardHeader className="p-8 pb-0">
               <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-800 flex items-center gap-2">
                 <Clock className="w-4 h-4 text-zinc-400" /> Fulfillment Timeline
               </CardTitle>
             </CardHeader>
             <CardContent className="p-8">
                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-zinc-100">
                   {ORDER.timeline.map((step, i) => (
                      <div key={i} className="flex gap-6 relative pl-8">
                         <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center z-10 ${step.current ? 'border-brand-gold' : 'border-zinc-200'}`}>
                            {step.current ? <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" /> : <div className="w-2 h-2 rounded-full bg-zinc-200" />}
                         </div>
                         <div className="space-y-1">
                            <div className="flex items-center gap-4">
                               <p className="text-xs font-bold text-zinc-900">{step.event}</p>
                               <span className="text-[10px] text-zinc-400 font-mono">{step.time}</span>
                            </div>
                            <p className="text-[11px] text-zinc-500 font-light">{step.details}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Customer Insights */}
          <Card className="rounded-[2.5rem] border-zinc-100 shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-zinc-50 pb-6">
               <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-800 flex items-center gap-2">
                 <User className="w-4 h-4 text-zinc-400" /> Customer Data
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-brand-rose/20 flex items-center justify-center text-xl font-heading text-brand-black border border-brand-rose/30">
                     SJ
                  </div>
                  <div className="space-y-1">
                     <p className="text-sm font-bold text-zinc-900">{ORDER.customer.name}</p>
                     <Badge className="bg-zinc-900 text-white rounded-full text-[8px] font-black uppercase tracking-widest px-2">
                       {ORDER.customer.role}
                     </Badge>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Private Email
                    </p>
                    <p className="text-xs font-medium text-zinc-800 cursor-pointer hover:text-brand-gold transition-colors">{ORDER.customer.email}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Contact Number
                    </p>
                    <p className="text-xs font-medium text-zinc-800">{ORDER.customer.phone}</p>
                  </div>
               </div>

               <div className="pt-6 border-t border-zinc-100 flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  <span>Loyalty Account Since</span>
                  <span className="text-zinc-800">{ORDER.customer.memberSince}</span>
               </div>
            </CardContent>
          </Card>

          {/* Shipping Logistics */}
          <Card className="rounded-[2.5rem] border-zinc-100 shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-zinc-50 pb-6">
               <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-800 flex items-center gap-2">
                 <Truck className="w-4 h-4 text-zinc-400" /> Artistry Logistics
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
               <div className="space-y-3">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Shipping Destination
                  </p>
                  <p className="text-xs text-zinc-800 leading-relaxed font-medium">
                     {ORDER.shippingAddress}
                  </p>
                  <Link href="https://maps.google.com" target="_blank" className="inline-flex items-center gap-2 text-[9px] font-black text-brand-gold uppercase tracking-tighter hover:opacity-75 transition-opacity">
                    Verify Address Flow <ExternalLink className="w-3 h-3" />
                  </Link>
               </div>
            </CardContent>
          </Card>

          {/* Secure Payment */}
          <Card className="rounded-[2.5rem] border-zinc-100 shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-zinc-50 pb-6">
               <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-800 flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Payment
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
               <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm">
                     <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">{ORDER.payment.method}</p>
                    <p className="text-[10px] text-zinc-400 font-mono tracking-tighter truncate w-[150px]">{ORDER.payment.id}</p>
                  </div>
               </div>
               <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  <span>Merchant Status</span>
                  <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-black">Authorized</span>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
