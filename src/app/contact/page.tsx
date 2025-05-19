"use client";

import { useState } from "react";
import Header from "../components/Header";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // This is a placeholder for actual form submission
    // In a real application, you would connect this to your backend
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitStatus({
        success: true,
        message: "Thank you for your message. We will get back to you soon!",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message:
          "There was an error sending your message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />

      <div className="flex-grow">
        <div className="max-w-4xl mx-auto py-16 px-4">
          <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-teal-300">
                Get in Touch
              </h2>
              <p className="text-gray-300 mb-8">
                Have questions, feedback, or need assistance with our Video
                Upscaler? Fill out the form and we'll get back to you as soon as
                possible.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-900/50 flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-teal-300"
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
                    <div className="text-sm text-gray-400">Email</div>
                    <div>support@videoupscaler.com</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-900/50 flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-teal-300"
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
                    <div className="text-sm text-gray-400">Response Time</div>
                    <div>Usually within 24-48 hours</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {submitStatus ? (
                <div
                  className={`p-6 rounded-lg mb-8 ${
                    submitStatus.success
                      ? "bg-teal-900/30 text-teal-300"
                      : "bg-red-900/30 text-red-300"
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {submitStatus.success ? "Message Sent!" : "Error"}
                  </h3>
                  <p>{submitStatus.message}</p>
                  {submitStatus.success && (
                    <button
                      onClick={() => setSubmitStatus(null)}
                      className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Send Another Message
                    </button>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-gray-800 rounded-lg p-6"
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
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
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
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
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
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
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
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                      isSubmitting
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-teal-600 hover:bg-teal-700"
                    }`}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="/"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-3 md:mb-0">
            © 2025 Application. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <a
              href="/terms"
              className="text-gray-400 hover:text-teal-300 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/privacy"
              className="text-gray-400 hover:text-teal-300 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/contact"
              className="text-gray-400 hover:text-teal-300 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
