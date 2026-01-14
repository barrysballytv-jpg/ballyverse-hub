import { motion } from "framer-motion";

export default function TermsOfService() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 border border-primary/20 p-8 md:p-12 rounded-lg backdrop-blur-sm"
        >
          <h1 className="text-3xl md:text-5xl font-display text-primary mb-8 tracking-widest text-center">
            TERMS OF SERVICE
          </h1>
          
          <div className="prose prose-invert prose-gold max-w-none font-body leading-relaxed space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-display text-white mb-4">Effective Date: January 14, 2026</h2>
              <p>
                Welcome to BALLYUPGANG, operated by BALLY UP GANG and accessible at ballyupgang.com. These Terms of Service (“Terms”) govern your access to and use of our website and mobile app (the “Service”), which provides merchandise sales and information on upcoming events. By using the Service, you agree to these Terms. If you disagree, do not use the Service.
              </p>
              <p>For questions, contact us at balliedupgang@gmail.com.</p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Acceptance of Terms</h2>
              <p>
                By accessing or using the Service, you confirm you’re at least 18 years old (or the age of majority in your jurisdiction) and agree to these Terms, our Privacy Policy, and any additional terms for specific features.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">User Accounts</h2>
              <p>
                To access certain features like purchases or event registrations, you may need an account. You must provide accurate information and keep your password secure. You’re responsible for all activity on your account. Notify us immediately of any unauthorized use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">User Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for illegal purposes or violate laws.</li>
                <li>Post harmful, abusive, or infringing content.</li>
                <li>Interfere with the Service or others’ use.</li>
                <li>Attempt to hack, spam, or transmit viruses.</li>
              </ul>
              <p>We may suspend or terminate your account for violations.</p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Intellectual Property</h2>
              <p>
                All content on the Service (text, images, logos) is owned by BALLY UP GANG or licensors and protected by copyright, trademark, and other laws. You may not copy, modify, or distribute without permission. Limited license granted for personal use only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Purchases and Payments</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Prices and availability subject to change.</li>
                <li>Payments processed via third-party providers; we don’t store card details.</li>
                <li>All sales final unless stated otherwise. Refunds per our policy.</li>
                <li>Shipping and taxes are your responsibility.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Events</h2>
              <p>
                Event info is for informational purposes. We aren’t liable for changes, cancellations, or issues at events. Tickets or registrations may have separate terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Disclaimers</h2>
              <p>
                The Service is provided “as is” without warranties. We disclaim all implied warranties of merchantability, fitness, or non-infringement. We don’t guarantee accuracy, timeliness, or virus-free operation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, BALLY UP GANG isn’t liable for indirect, incidental, or consequential damages arising from the Service, even if advised of possibility. Liability limited to amount paid by you in the last 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Indemnification</h2>
              <p>
                You agree to indemnify BALLY UP GANG from claims arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Governing Law</h2>
              <p>
                These Terms are governed by the laws of South Australia, Australia, without regard to conflict of laws. Disputes resolved in Adelaide courts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Changes to Terms</h2>
              <p>
                We may update these Terms. We’ll notify via the Service or email. Continued use constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Termination</h2>
              <p>
                We may terminate your access at any time for any reason. Provisions like IP, disclaimers, and liability survive termination.
              </p>
            </section>

            <section className="pt-8 border-t border-primary/10">
              <h2 className="text-xl font-display text-white mb-4">Contact Us</h2>
              <p>Email: <a href="mailto:balliedupgang@gmail.com" className="text-primary hover:underline">balliedupgang@gmail.com</a></p>
            </section>
            
            <p className="text-xs italic mt-12 opacity-50">
              Disclaimer: This is a statement of Terms for BALLY UP GANG. For formal legal compliance with Australian consumer laws or the Competition and Consumer Act 2010, please consult with legal counsel.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
