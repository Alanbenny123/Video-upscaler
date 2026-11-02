"use client";

import { useState } from "react";
import Header from "../components/Header";
import Link from "next/link";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `${formData.subject}: Video Upscaler`;
    const body = `Name: ${formData.name}\nReply email: ${formData.email}\n\n${formData.message}`;
    window.location.href =
      `mailto:support@videoupscaler.com?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
      <Header />

      <div className="flex-grow">
        <div className="max-w-4xl mx-auto py-16 px-4">
          <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-neutral-200">
                Get in Touch
              </h2>
              <p className="text-neutral-300 mb-8">
                Have questions, feedback, or need assistance with our Video
                Upscaler? Fill out the form to open a draft in your email app.
                Review and send it there.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-neutral-700/50 flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-neutral-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-400">Email</div>
                    <a
                      href="mailto:support@videoupscaler.com"
                      className="hover:underline"
                    >
                      support@videoupscaler.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-neutral-700/50 flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-neutral-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-400">Sending</div>
                    <div>Your email app handles delivery</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form
                onSubmit={handleSubmit}
                className="bg-neutral-800 rounded-lg p-6"
              >
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-md text-white"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-md text-white"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-md text-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="bug">Report a Bug</option>
                      <option value="feature">Feature Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-md text-white resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-md font-medium text-white transition-colors bg-neutral-600 hover:bg-neutral-500"
                  >
                    Open Email Draft
                  </button>
              </form>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-block bg-neutral-600 hover:bg-neutral-500 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 py-4 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-neutral-400 text-sm mb-3 md:mb-0">
            &copy; 2025 Application. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <Link
              href="/terms"
              className="text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
