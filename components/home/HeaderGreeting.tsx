"use client";
import React from "react";

export const HeaderGreeting: React.FC = () => (
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 grid place-items-center">
      <div className="w-12 h-12 rounded-full bg-white grid place-items-center shadow">
        <span className="text-xl">👔</span>
      </div>
    </div>
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Hello, Testers!</h1>
      <p className="text-sm text-neutral-500">
        Feel good for you to come back!
      </p>
    </div>
  </div>
);
