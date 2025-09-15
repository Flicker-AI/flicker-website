"use client";
import { Megaphone } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = { titleTop: string; titleBottom?: string; count?: number };

export const MatchCard: React.FC<Props> = ({
  titleTop,
  titleBottom,
  count,
}) => (
  <div className="relative flex flex-col w-[180px] rounded-2xl bg-white shadow hover:shadow-lg transition-shadow shrink-0 snap-start">
    <div className="relative h-36 overflow-hidden rounded-2xl m-3">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-sky-200 to-pink-200" />
      <div className="absolute inset-0 p-3 flex items-center justify-between">
        <div className="w-16 h-16 rounded-xl bg-white/70 backdrop-blur grid place-items-center">
          <Megaphone className="w-8 h-8 text-neutral-700" />
        </div>
        <div className="w-20 h-16 rounded-xl bg-white/70 backdrop-blur grid place-items-center">
          <Image
            src={`data:image/svg+xml;utf8,${encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'><circle cx='20' cy='20' r='8' fill='black'/><rect x='40' y='10' width='70' height='12' rx='6' fill='black' opacity='0.2'/><rect x='40' y='30' width='50' height='12' rx='6' fill='black' opacity='0.2'/><rect x='40' y='50' width='60' height='12' rx='6' fill='black' opacity='0.2'/></svg>`
            )}`}
            alt="decor"
            width={100}
            height={70}
          />
        </div>
      </div>

      {/* {typeof count === "number" && (
        <div className="absolute -top-2 -right-2">
          <div className="w-9 h-9 rounded-full bg-red-500 text-white grid place-items-center text-sm font-bold shadow">
            {count}
          </div>
        </div>
      )} */}
    </div>

    <div className="px-4 pb-4 text-center">
      <div className="text-neutral-800 font-semibold">{titleTop}</div>
      {titleBottom && <div className="text-neutral-800">{titleBottom}</div>}
    </div>
  </div>
);
