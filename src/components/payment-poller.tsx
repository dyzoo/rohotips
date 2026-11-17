"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { orderStatusAction } from "@/app/actions";

const styles: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  paid: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  failed: "bg-red-500/15 text-red-300 border-red-500/30",
  cancelled: "bg-white/10 text-white/60 border-white/20",
};

export function PaymentPoller({ orderId, initialStatus }: { orderId: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const router = useRouter();

  useEffect(() => {
    if (status === "paid" || status === "failed" || status === "cancelled") return;
    const timer = setInterval(async () => {
      const result = await orderStatusAction(orderId);
      if (!result) return;
      if (result.status !== status) {
        setStatus(result.status);
        router.refresh();
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [orderId, status, router]);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${
        styles[status] ?? styles.pending
      }`}
    >
      {status}
    </span>
  );
}
