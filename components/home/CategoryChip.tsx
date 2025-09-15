"use client";
import { Lock } from "lucide-react";
import React from "react";
import { Badge } from "../ui/Badge";

type Props = {
  icon: React.ReactNode;
  labelTop: string;
  labelBottom?: string;
  count?: number;
  locked?: boolean;
};

export const CategoryChip: React.FC<Props> = ({
  icon,
  labelTop,
  labelBottom,
  count,
  locked,
}) => (
  <div className="flex flex-col items-center gap-3 shrink-0 snap-start w-20">
    <div className="relative grid place-items-center w-16 h-16 rounded-full bg-neutral-100 shadow-inner">
      {icon}
      {typeof count === "number" && <Badge count={count} />}
      {locked && (
        <div className="absolute inset-0 grid place-items-center rounded-full bg-white/50">
          <div className="grid place-items-center w-16 h-16 rounded-full bg-white shadow">
            <Lock className="w-6 h-6 text-red-500" />
          </div>
        </div>
      )}
    </div>
    <div className="text-center text-neutral-700 leading-tight">
      <div className="text-sm font-medium">{labelTop}</div>
      {/* {labelBottom && <div className="text-sm">{labelBottom}</div>} */}
    </div>
  </div>
);
