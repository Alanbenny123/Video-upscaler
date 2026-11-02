"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // ThemeProvider mounts after ThemeWrapper has loaded the saved preference.
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window !== "undefined" && localStorage.getItem("theme") === "light"
      ? "light"
      : "dark"
  );

  // Apply theme changes to document
  useEffect(() => {
    // Update document class
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);

    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
