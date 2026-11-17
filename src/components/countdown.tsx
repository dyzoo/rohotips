"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Countdown({ validity }: { validity: string }) {
  const [label, setLabel] = useState("...");
  const router = useRouter();
  const refreshed = useRef(false);

  useEffect(() => {
    const tick = () => {
      const diff = new Date(validity).getTime() - Date.now();
      if (diff <= 0) {
        setLabel("Expired");
        if (!refreshed.current) {
          refreshed.current = true;
          router.refresh();
        }
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setLabel(`${hours}h ${minutes}m ${seconds}s`);
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [validity, router]);

  return <span className="font-semibold text-white">{label}</span>;
}
