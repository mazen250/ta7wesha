import { ArrowLeft } from 'lucide-react';

export default function Terms() {
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
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-[var(--c-text-3)] mb-10">
          Last updated: April 2, 2026
        </p>

        <div className="space-y-8 text-[var(--c-text-2)] text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">1. Acceptance of Terms</h2>
            <p>
              By downloading, installing, or using Ta7wesha (&ldquo;the App&rdquo;), you agree to
              be bound by these Terms &amp; Conditions. If you do not agree, please do not use
              the App.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">2. Description of Service</h2>
            <p>
              Ta7wesha is a personal savings tracking application that allows you to record
              savings in multiple currencies and gold, view live exchange rates, set financial
              goals, and use various financial calculators. The App is provided free of charge.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">3. Not Financial Advice</h2>
            <p>
              The App is a tool for personal record-keeping and informational purposes only.
              Nothing in the App constitutes financial, investment, tax, or legal advice. Exchange
              rates and gold prices are sourced from third-party providers and may not reflect
              exact real-time market values. You should not make financial decisions based solely
              on information provided by the App. Always consult a qualified financial advisor for
              financial decisions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">4. User Responsibilities</h2>
            <p>You are responsible for:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-[var(--c-text-3)]">
              <li>The accuracy of the data you enter into the App</li>
              <li>Maintaining backups of your data if desired</li>
              <li>Using the App in compliance with applicable laws</li>
              <li>Keeping your device secure, as your data is stored locally</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">5. Data &amp; Privacy</h2>
            <p>
              All data you enter is stored locally on your device. We do not collect, access, or
              store your personal or financial data. For full details, please refer to our{' '}
              <a href="#/privacy" className="text-[var(--c-emerald)] hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">6. Exchange Rates &amp; Pricing Data</h2>
            <p>
              Exchange rates and gold prices displayed in the App are fetched from third-party
              sources. We make no guarantees regarding the accuracy, completeness, or timeliness
              of this data. Rates may differ from those offered by banks, exchanges, or other
              financial institutions. The App should not be used as a sole source for financial
              transactions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">7. Intellectual Property</h2>
            <p>
              The App, including its design, code, graphics, and content, is the property of the
              developer and is protected by applicable intellectual property laws. You may not
              copy, modify, distribute, or reverse-engineer any part of the App.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">8. Limitation of Liability</h2>
            <p>
              The App is provided &ldquo;as is&rdquo; without warranties of any kind, either
              express or implied. To the fullest extent permitted by law, the developer shall not
              be liable for any damages arising from your use of the App, including but not
              limited to: loss of data, financial losses, or damages resulting from reliance on
              exchange rate data displayed in the App.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">9. App Availability</h2>
            <p>
              We strive to keep the App available and functional, but we do not guarantee
              uninterrupted access. The App may be temporarily unavailable due to maintenance,
              updates, or factors beyond our control. Exchange rate data depends on third-party
              services and may occasionally be unavailable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">10. Changes to These Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be posted on
              this page with an updated date. Continued use of the App after changes are posted
              constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">11. Termination</h2>
            <p>
              You may stop using the App at any time by uninstalling it. Upon uninstallation, all
              locally stored data will be permanently deleted.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws.
              Any disputes arising from these Terms or your use of the App shall be resolved
              through appropriate legal channels.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">13. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at{' '}
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
