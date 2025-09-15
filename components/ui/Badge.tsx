import React from "react";

type Props = { count: number; className?: string };

export const Badge: React.FC<Props> = ({ count, className }) => (
  <span
    className={`absolute -top-2 -right-2 inline-flex items-center justify-center
      text-xs font-bold rounded-full min-w-5 h-5 px-1.5 bg-red-500 text-white shadow ${
        className ?? ""
      }`}
  >
    {count}
  </span>
);
