import Header from "../components/Header";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />

      <div className="flex-grow">
        <div className="max-w-4xl mx-auto py-16 px-4">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                1. Acceptance of Terms
              </h2>
              <p className="mb-4">
                By accessing and using this Video Upscaler service, you
                acknowledge that you have read, understood, and agree to be
                bound by these Terms of Service. If you do not agree to these
                terms, please do not use our service.
              </p>
              <p>
                We reserve the right to modify these terms at any time. Your
                continued use of the service after any such changes constitutes
                your acceptance of the new Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                2. Service Description
              </h2>
              <p className="mb-4">
                Video Upscaler is a free online service that allows users to
                upscale videos to higher resolutions using browser-based
                technology. All processing occurs locally in your browser; no
                videos are uploaded to our servers.
              </p>
              <p>
                While we strive to provide reliable service, we cannot guarantee
                that the service will be error-free, secure, or available at all
                times.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                3. User Responsibilities
              </h2>
              <p className="mb-4">
                You are responsible for ensuring that you have the legal right
                to use, modify, and upscale any videos processed through our
                service. You agree not to use our service for any illegal
                purposes or to violate any local, state, national, or
                international laws.
              </p>
              <p>
                You acknowledge that we have no responsibility for the content
                of videos processed through our service. We do not monitor or
                review the content of videos processed by users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                4. Intellectual Property
              </h2>
              <p className="mb-4">
                Video Upscaler and its original content, features, and
                functionality are owned by us and are protected by international
                copyright, trademark, patent, trade secret, and other
                intellectual property laws.
              </p>
              <p>
                We do not claim any ownership rights in the videos that you
                process through our service. You retain all your rights to your
                videos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                5. Limitation of Liability
              </h2>
              <p className="mb-4">
                To the maximum extent permitted by law, we shall not be liable
                for any indirect, incidental, special, consequential, or
                punitive damages, or any loss of profits or revenues, whether
                incurred directly or indirectly, or any loss of data, use,
                goodwill, or other intangible losses resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use or inability to use our service</li>
                <li>
                  Any unauthorized access to or use of our servers or any
                  personal information stored therein
                </li>
                <li>
                  Any interruption or cessation of transmission to or from our
                  service
                </li>
                <li>
                  Any bugs, viruses, trojan horses, or the like that may be
                  transmitted to or through our service
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                6. Changes to Service
              </h2>
              <p>
                We reserve the right to withdraw or amend our service, and any
                service or material we provide, in our sole discretion without
                notice. We will not be liable if, for any reason, all or any
                part of the service is unavailable at any time or for any
                period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                7. Governing Law
              </h2>
              <p>
                These Terms shall be governed and construed in accordance with
                the laws, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                8. Contact Information
              </h2>
              <p>
                If you have any questions about these Terms, please contact us
                through the Contact page.
              </p>
            </section>
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
