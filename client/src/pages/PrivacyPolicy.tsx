import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 border border-primary/20 p-8 md:p-12 rounded-lg backdrop-blur-sm"
        >
          <h1 className="text-3xl md:text-5xl font-display text-primary mb-8 tracking-widest text-center">
            PRIVACY POLICY
          </h1>
          
          <div className="prose prose-invert prose-gold max-w-none font-body leading-relaxed space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-display text-white mb-4">Effective Date: January 14, 2026</h2>
              <p>
                At BALLY UP GANG, accessible from ballyupgang.com, we prioritize your privacy. This policy explains what information we collect from users of our app for merchandise and upcoming events, and how we use it. For questions, contact us at balliedupgang@gmail.com.
              </p>
              <p>
                This policy applies only to our online activities and not to offline or other channels.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Consent</h2>
              <p>By using our app, you consent to this Privacy Policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Information We Collect</h2>
              <p>
                We collect personal information you provide, such as name, email, phone, and contact details when you register, contact us, or make purchases. We also gather device info (IP address, browser type, OS), usage data (pages visited, time spent), and for mobile: location (if enabled) and push preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Operate and maintain the app</li>
                <li>Improve and personalize features</li>
                <li>Analyze usage</li>
                <li>Communicate updates, marketing, and customer service</li>
                <li>Prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Log Files, Cookies, and Beacons</h2>
              <p>
                We use log files for analytics (IP, browser, ISP, timestamps, pages). These aren’t personally identifiable. Cookies store preferences to optimize experience. We may use web beacons for ads.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Third-Party Policies</h2>
              <p>
                Third-party advertisers may use cookies/beacons; we have no control over them. Check their privacy policies for opt-outs. Disable cookies via your browser.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Your Privacy Rights</h2>
              <p>
                You may have rights under laws like Australian Privacy Principles, GDPR, or CCPA (access, correct, delete data). Contact us to exercise them.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Data Security</h2>
              <p>We implement measures to protect your data from unauthorized access or loss.</p>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-4">Changes to This Policy</h2>
              <p>We’ll post updates here and notify via email or app notice. Review periodically.</p>
            </section>

            <section className="pt-8 border-t border-primary/10">
              <h2 className="text-xl font-display text-white mb-4">Contact Us</h2>
              <p>Email: <a href="mailto:balliedupgang@gmail.com" className="text-primary hover:underline">balliedupgang@gmail.com</a></p>
            </section>
            
            <p className="text-xs italic mt-12 opacity-50">
              Disclaimer: This is a policy statement for BALLY UP GANG. For formal legal compliance with the Australian Privacy Act 1988, please consult with legal counsel.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
