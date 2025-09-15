"use client";

import { motion } from "framer-motion";
import { GalleryVerticalEnd, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { className?: string };

function TogglePill({ className = "" }: Props) {
  const pathname = usePathname();
  const activeIndex = pathname?.startsWith("/matches") ? 1 : 0;

  return (
    <nav
      aria-label="Primary"
      className={`relative mx-auto ${className} w-50 h-16 mt-5 rounded-full bg-neutral-900/90 shadow-inner p-1 overflow-hidden`}
    >
      {/* ตัวเลื่อน (thumb) — ใช้ left แทน translateX เพื่อไม่ให้ล้นขอบ */}
      <motion.div
        aria-hidden
        className="absolute inset-y-1 rounded-full bg-white shadow z-0 w-[calc(50%-0.5rem)]"
        initial={false}
        animate={{
          left: activeIndex === 0 ? "0.25rem" : "calc(50% + 0.25rem)",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />

      {/* สองแท็บ */}
      <div className="relative z-10 grid grid-cols-2 h-full">
        <Link
          href="/"
          className={`flex items-center justify-center rounded-full outline-none transition-colors ${
            activeIndex === 0
              ? "text-neutral-900"
              : "text-white/80 hover:text-white"
          }`}
          aria-current={activeIndex === 0 ? "page" : undefined}
        >
          <Home className="size-5" />
        </Link>

        <Link
          href="/matches"
          className={`flex items-center justify-center rounded-full outline-none transition-colors ${
            activeIndex === 1
              ? "text-neutral-900"
              : "text-white/80 hover:text-white"
          }`}
          aria-current={activeIndex === 1 ? "page" : undefined}
        >
          <GalleryVerticalEnd className="size-5" />
        </Link>
      </div>
    </nav>
  );
}

export default TogglePill;
export { TogglePill };
