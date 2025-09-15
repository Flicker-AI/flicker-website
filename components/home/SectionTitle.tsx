import React from "react";

export const SectionTitle: React.FC<React.PropsWithChildren> = ({
  children,
}) => <h2 className="text-2xl font-semibold">{children}</h2>;
