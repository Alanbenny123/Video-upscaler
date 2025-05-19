"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-navbar text-foreground py-3 border-b border-navbar sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-white"
            >
              <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zm.75 7.5a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6zm0 3a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6zm0-6a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6zm9.75 5.25a1.5 1.5 0 013 0v2.25a1.5 1.5 0 01-3 0V14.25z" />
              <path d="M16.5 6.5h-3a.75.75 0 000 1.5h3a.75.75 0 000-1.5z" />
            </svg>
          </div>
          <span>Upscaler</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="hover:text-primary transition-colors py-1"
          >
            Features
          </a>
          <a href="#how" className="hover:text-primary transition-colors py-1">
            How It Works
          </a>
          <a href="#faq" className="hover:text-primary transition-colors py-1">
            FAQ
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile Nav Controls */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 py-3 bg-card border-b border-card transition-all duration-300">
          <div className="flex flex-col space-y-3">
            <a
              href="#features"
              className="hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how"
              className="hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#faq"
              className="hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
