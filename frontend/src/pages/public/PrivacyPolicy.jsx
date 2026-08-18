import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-green-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-green-200">Last updated: January 2024</motion.p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 prose prose-gray dark:prose-invert">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-8 text-gray-600 dark:text-gray-400">
            <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2><p>We collect information you provide directly to us, including name, mobile number, email address, village details, agricultural data, and photographs of farms and products.</p></div>
            <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2><p>Your information is used to create and manage your profile, facilitate agricultural procurement, generate reports, improve our services, and communicate with you regarding platform updates.</p></div>
            <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Data Security</h2><p>We implement industry-standard security measures including encryption, secure servers, and access controls to protect your personal information from unauthorized access.</p></div>
            <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Data Sharing</h2><p>Your data is shared with Raigad Agro Solution for procurement purposes. We do not sell your personal information to third parties.</p></div>
            <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Your Rights</h2><p>You have the right to access, update, or delete your personal information. You can manage your data through your profile settings or contact us for assistance.</p></div>
            <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Contact Us</h2><p>If you have any questions about this Privacy Policy, please contact us at info@gramsampan.com or call +91 98765 43210.</p></div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
