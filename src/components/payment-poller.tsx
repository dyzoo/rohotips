"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { orderStatusAction } from "@/app/actions";

const styles: Record<string, string> = {
  pending: "border-yellow-500/35 bg-yellow-500/10 text-yellow-300",
  paid: "border-emerald-500/35 bg-emerald-500/10 text-emerald-300",
  failed: "border-red-500/35 bg-red-500/10 text-red-300",
  cancelled: "border-white/20 bg-white/5 text-white/60",
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
      className={`inline-flex items-center border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${
        styles[status] ?? styles.pending
      }`}
    >
      {status}
    </span>
  );
}
