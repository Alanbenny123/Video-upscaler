import Header from "../components/Header";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />

      <div className="flex-grow">
        <div className="max-w-4xl mx-auto py-16 px-4">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                1. Introduction
              </h2>
              <p className="mb-4">
                This Privacy Policy explains how we collect, use, store, and
                protect your information when you use our Video Upscaler
                service. We are committed to ensuring the privacy and security
                of your data.
              </p>
              <p>
                By using our service, you agree to the collection and use of
                information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                2. Information We Don&apos;t Collect
              </h2>
              <p className="mb-4">
                Our Video Upscaler service processes all videos locally in your
                browser. We do not upload, store, or access any of your video
                content on our servers. Your videos remain on your device.
              </p>
              <p>
                We do not collect personally identifiable information such as
                names, email addresses, or payment information, as our service
                does not require user accounts or payments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                3. Anonymous Usage Data
              </h2>
              <p className="mb-4">
                We may collect anonymous usage data for the purpose of improving
                our service. This data may include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Time and date of service usage</li>
                <li>Pages visited</li>
                <li>
                  Anonymous usage statistics (e.g., number of videos processed,
                  average processing time)
                </li>
              </ul>
              <p className="mt-4">
                This information is used solely for analyzing trends,
                administering the site, and improving our service. This data
                cannot be used to identify individual users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                4. Cookies
              </h2>
              <p className="mb-4">
                We use cookies to enhance your experience on our website.
                Cookies are small text files that are placed on your computer by
                websites that you visit. They are widely used to make websites
                work more efficiently and to provide information to the website
                owners.
              </p>
              <p className="mb-4">
                The cookies we use are essential for the operation of our
                website and service. You can set your browser to refuse all or
                some browser cookies, but this may prevent some parts of our
                website from functioning properly.
              </p>
              <p>
                We do not use cookies to collect personally identifiable
                information about you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                5. Third-Party Services
              </h2>
              <p className="mb-4">
                We may use third-party services, such as analytics providers, to
                help us understand how our service is being used. These services
                may collect information sent by your browser as part of a web
                page request, such as cookies or your IP address.
              </p>
              <p>
                These third-party services have their own privacy policies
                addressing how they use such information. We encourage you to
                read their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                6. Data Security
              </h2>
              <p className="mb-4">
                We are committed to ensuring that your information is secure. We
                have implemented suitable physical, electronic, and managerial
                procedures to safeguard and secure the information we collect
                online.
              </p>
              <p>
                However, no method of transmission over the Internet or method
                of electronic storage is 100% secure. While we strive to use
                commercially acceptable means to protect your information, we
                cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                7. Changes to This Privacy Policy
              </h2>
              <p className="mb-4">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &quot;last updated&quot; date.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for
                any changes. Changes to this Privacy Policy are effective when
                they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                8. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us through the Contact page.
              </p>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-3 md:mb-0">
            &copy; 2025 Application. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <Link
              href="/terms"
              className="text-gray-400 hover:text-teal-300 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-teal-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="text-gray-400 hover:text-teal-300 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
