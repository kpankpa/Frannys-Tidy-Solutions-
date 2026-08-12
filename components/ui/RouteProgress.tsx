"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const tickRef = useRef<number | null>(null);
  const hideRef = useRef<number | null>(null);

  useEffect(() => {
    if (tickRef.current) window.clearInterval(tickRef.current);
    if (hideRef.current) window.clearTimeout(hideRef.current);

    setVisible(true);
    setProgress(18);

    tickRef.current = window.setInterval(() => {
      setProgress((value) => (value >= 88 ? value : value + 12));
    }, 180);

    hideRef.current = window.setTimeout(() => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      setProgress(100);
      hideRef.current = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 280);
    }, 420);

    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      if (hideRef.current) window.clearTimeout(hideRef.current);
    };
  }, [pathname, searchParams]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
      )}
      aria-hidden
    >
      <div
        className="h-full bg-secondary shadow-[0_0_8px_rgba(0,0,0,0.15)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
