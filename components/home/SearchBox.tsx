"use client";
import { Search } from "lucide-react";
import React from "react";

export const SearchBox: React.FC = () => (
  <div className="flex items-center gap-3 bg-white rounded-2xl pl-4 pr-4 h-12 shadow-inner ring-1 ring-black/5">
    <Search className="w-5 h-5 text-neutral-400" />
    <input
      placeholder="Search the cards"
      className="w-full bg-transparent outline-none placeholder:text-neutral-400 text-[15px]"
    />
  </div>
);
