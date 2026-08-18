import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-green-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-green-200">Last updated: January 2024</motion.p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-8 text-gray-600 dark:text-gray-400">
            <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2><p>By accessing and using Gram Sampan Agro Ltd's platform, you agree to comply with and be bound by these Terms and Conditions.</p></div>
            <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. User Accounts</h2><p>You are responsible for maintaining the confidentiality of your account credentials. All activities under your account are your responsibility.</p></div>
            <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Data Accuracy</h2><p>You agree to provide accurate and complete information. Misrepresentation of data may result in account suspension.</p></div>
            <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Platform Usage</h2><p>The platform is intended for agricultural data management and procurement coordination between farmers, SHGs, CRP Tais, and Raigad Agro Solution.</p></div>
            <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Intellectual Property</h2><p>All content and technology on this platform is the property of Gram Sampan Agro Ltd and protected by applicable laws.</p></div>
            <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Limitation of Liability</h2><p>Gram Sampan Agro Ltd shall not be liable for any indirect, incidental, or consequential damages arising from platform usage.</p></div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
