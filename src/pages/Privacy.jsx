import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-dvh px-4 py-12 sm:py-20">
      <div className="max-w-3xl mx-auto">
        <a
          href="#/"
          className="inline-flex items-center gap-2 text-sm text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors mb-10"
        >
          <ArrowLeft size={16} />
          Back to home
        </a>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-[var(--c-text-3)] mb-10">
          Last updated: April 2, 2026
        </p>

        <div className="space-y-8 text-[var(--c-text-2)] text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">Overview</h2>
            <p>
              Ta7wesha (&ldquo;the App&rdquo;) is a privacy-first savings tracker. We are committed
              to protecting your privacy. This policy explains what data the App collects
              (spoiler: virtually none) and how it is handled.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">Data Collection</h2>
            <p>
              Ta7wesha does <strong>not</strong> collect, store, or transmit any personal data.
              All savings entries, goals, budgets, and preferences you create are stored
              exclusively on your device using local storage. We have no servers that receive
              your financial information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">Exchange Rate Data</h2>
            <p>
              The App fetches live currency and gold exchange rates from third-party APIs to
              display up-to-date pricing. These requests do not include any personal
              information, savings data, or device identifiers. Only standard HTTP metadata
              (such as your IP address) is transmitted as part of these network requests, which
              is standard for any internet connection.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">No Accounts</h2>
            <p>
              Ta7wesha does not require you to create an account, sign in, or provide an email
              address. There is no registration process and no user profiles.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">No Analytics or Tracking</h2>
            <p>
              We do not use any analytics services, crash reporters, or tracking pixels. We do
              not track how you use the App, which screens you visit, or how long you spend in
              the App. There are no cookies, no fingerprinting, and no advertising identifiers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">No Advertising</h2>
            <p>
              Ta7wesha does not display ads of any kind. We do not share data with advertising
              networks or data brokers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">Data Storage &amp; Security</h2>
            <p>
              All data is stored locally on your device. If you delete the App, all associated
              data is permanently removed. We recommend using your device&rsquo;s built-in backup
              features if you wish to preserve your data. The App provides an export feature so
              you can save a copy of your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">Third-Party Services</h2>
            <p>
              The only external services the App communicates with are currency and gold price
              APIs. These services have their own privacy policies. No personal or financial
              data from the App is sent to these services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">Children&rsquo;s Privacy</h2>
            <p>
              The App does not knowingly collect data from children under 13, nor does it
              collect data from anyone. The App is suitable for all ages.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be reflected
              on this page with an updated &ldquo;Last updated&rdquo; date. Since we don&rsquo;t
              collect your contact information, we encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a
                href="mailto:mazenfayez56@gmail.com"
                className="text-[var(--c-emerald)] hover:underline"
              >
                mazenfayez56@gmail.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--c-border)] text-center">
          <p className="text-xs text-[var(--c-text-4)]">
            &copy; 2026 Ta7wesha. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
