import React from "react";

export const Button = ({ children }: { children: React.ReactNode }) => (
  <button
    style={{ padding: 8, borderRadius: 4, background: "#222", color: "#fff" }}
  >
    {children}
  </button>
);
