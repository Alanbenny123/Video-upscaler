"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with dark mode (will be updated in useEffect)
  const [theme, setTheme] = useState<Theme>("dark");

  // Initialize theme from localStorage when component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    // Use saved theme or system preference
    const initialTheme = savedTheme || systemPreference;
    setTheme(initialTheme);
  }, []);

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
