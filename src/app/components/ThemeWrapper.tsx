"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "../context/ThemeContext";

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") === "light" ? "light" : "dark";

    // Set the class on html element
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(savedTheme);

    setMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return <ThemeProvider>{children}</ThemeProvider>;
}
