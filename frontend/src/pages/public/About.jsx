import { motion } from 'framer-motion';
import { FiTarget, FiEye, FiCheckCircle, FiUsers, FiHeart, FiAward } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

export default function About() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold mb-4">About Us</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-green-200 max-w-3xl mx-auto">Gram Sampan Agro Ltd in partnership with Raigad Agro Solution is dedicated to transforming rural India through digital innovation.</motion.p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FiTarget, title: 'Our Mission', desc: 'To digitally empower every farmer and self-help group in rural India with modern data management tools, enabling them to make informed decisions and improve their livelihoods.' },
              { icon: FiEye, title: 'Our Vision', desc: 'A self-reliant rural ecosystem where every farmer and SHG has access to digital infrastructure, market opportunities, and sustainable growth pathways.' },
              { icon: FiCheckCircle, title: 'Our Values', desc: 'Integrity, Innovation, Inclusion, and Impact. We believe in creating solutions that are accessible, transparent, and beneficial to all stakeholders.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-green-50 dark:from-primary-900/30 dark:to-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6"><item.icon className="text-primary-600 dark:text-primary-400" size={32} /></div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="section-title">Why Choose Us</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FiUsers, title: '10,000+', desc: 'Farmers Registered' },
              { icon: FiHeart, title: '800+', desc: 'Mahila Groups' },
              { icon: FiAward, title: '5+ Years', desc: 'of Experience' },
              { icon: FiCheckCircle, title: '99.9%', desc: 'Uptime Guarantee' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card text-center">
                <item.icon className="text-primary-600 dark:text-primary-400 mx-auto mb-3" size={36} />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="section-title mb-4">Partner Company</h2>
            <p className="section-subtitle max-w-2xl mx-auto mb-8">Raigad Agro Solution is our trusted partner in agricultural procurement and rural development.</p>
            <Link to="/contact" className="btn-primary">Contact Us</Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
