import React from "react";

/** Wrap children to create a horizontal snapping scroller */
export const HorizontalScroller: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <div
    className={`mt-4 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth ${
      className ?? ""
    }`}
  >
    {children}
  </div>
);
