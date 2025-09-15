"use client";
import { ClipboardList, Coins, Lock, Megaphone } from "lucide-react";

import { CategoryChip } from "../components/home/CategoryChip";
import { HeaderGreeting } from "../components/home/HeaderGreeting";
import { HorizontalScroller } from "../components/home/HorizontalScroller";
import { MatchCard } from "../components/home/MatchCard";
import { SearchBox } from "../components/home/SearchBox";
import { SectionTitle } from "../components/home/SectionTitle";
import { TogglePill } from "../components/home/TogglePill";

export default function DashboardScreen() {
  // ---- mock data ----
  const categories = [
    { icon: <Coins className="w-8 h-8" />, labelTop: "Finance", count: 7 },
    {
      icon: <ClipboardList className="w-8 h-8" />,
      labelTop: "Checklist",
      count: 13,
    },
    {
      icon: <Megaphone className="w-8 h-8" />,
      labelTop: "Top Pick",
      labelBottom: "For You",
    },
    {
      icon: <Lock className="w-8 h-8 opacity-0" />,
      labelTop: "Market",
      labelBottom: "Radar",
      locked: true,
    },
    // เพิ่มรายการให้เกิน 3 เพื่อทดสอบสไลด์
    { icon: <Coins className="w-8 h-8" />, labelTop: "Budget" },
    { icon: <ClipboardList className="w-8 h-8" />, labelTop: "Tasks" },
  ];

  const matches = [
    { titleTop: "Marketing", titleBottom: "Agency", count: 7 },
    { titleTop: "OEM and", titleBottom: "Manufacturer", count: 9 },
    { titleTop: "Design", titleBottom: "Studio" },
    { titleTop: "Logistics", titleBottom: "Partner", count: 3 },
  ];

  return (
    <main className="px-2">
      {/* Status Bar spacer */}
      <div className="h-4" />

      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <HeaderGreeting />
      </div>

      {/* Search */}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex-1">
          <SearchBox />
        </div>
        <button
          className="grid place-items-center w-12 h-12 rounded-xl bg-yellow-400 shadow"
          aria-label="filters"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 5h18M6 12h12M10 19h4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-neutral-900"
            />
          </svg>
        </button>
      </div>

      {/* Categories (horizontal slider) */}
      <section className="mt-5">
        <SectionTitle>Categories</SectionTitle>
        <HorizontalScroller className="pt-2">
          {categories.map((c, i) => (
            <CategoryChip key={i} {...c} />
          ))}
        </HorizontalScroller>
      </section>

      {/* Business Matching (horizontal slider) */}
      <section className="mt-5">
        <SectionTitle>Business Matching for you</SectionTitle>
        <HorizontalScroller>
          {matches.map((m, i) => (
            <MatchCard key={i} {...m} />
          ))}
        </HorizontalScroller>
      </section>

      {/* Toggle */}
      <TogglePill />
    </main>
  );
}
