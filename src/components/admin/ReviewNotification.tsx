"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { getPendingReviewCountAction } from "@/app/admin/reviews/review-actions";

export function ReviewNotification() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const result = await getPendingReviewCountAction();
      if (result.success) {
        setPendingCount(result.count || 0);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/admin/reviews" className="relative p-2 text-zinc-500 hover:bg-zinc-100 rounded-xl transition-all group">
      <Bell size={20} className="group-hover:scale-110 transition-transform" />
      {pendingCount > 0 && (
        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4D6D] text-[10px] font-bold text-white shadow-sm animate-pulse">
          {pendingCount}
        </span>
      )}
    </Link>
  );
}
