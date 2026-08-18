import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFeather, FiMapPin, FiPhone, FiMail, FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center"><FiFeather className="text-white" size={22} /></div>
              <div><span className="text-lg font-bold text-white block">Gram Sampan</span><span className="text-xs text-primary-400">Agro Ltd</span></div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">Empowering farmers, strengthening rural communities through digital innovation and sustainable agricultural practices.</p>
            <div className="flex gap-3 mt-6">
              {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all hover:scale-110"><Icon size={18} /></a>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Services', path: '/services' },
                { label: 'Contact', path: '/contact' },
                { label: 'Admin / Owner Login', path: '/login?role=admin', highlight: true },
                { label: 'Privacy Policy', path: '/privacy-policy' },
                { label: 'Terms & Conditions', path: '/terms' },
              ].map((link) => (
                <li key={link.path}><Link to={link.path} className={`text-sm transition-colors ${link.highlight ? 'text-primary-400 hover:text-primary-300 font-medium' : 'text-gray-400 hover:text-primary-400'}`}>{link.label}</Link></li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-3">
              {['Farmer Registration', 'SHG Registration', 'CRP Management', 'Product Collection', 'Stock Management', 'Village Data', 'Reports'].map((s, i) => (
                <li key={i}><span className="text-sm text-gray-400 hover:text-primary-400 transition-colors cursor-pointer">{s}</span></li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3"><FiMapPin className="mt-1 text-primary-400 shrink-0" /><span className="text-sm text-gray-400">Gram Sampan Agro Ltd,<br />Partner: Raigad Agro Solution,<br />Maharashtra, India</span></li>
              <li className="flex items-center gap-3"><FiPhone className="text-primary-400 shrink-0" /><span className="text-sm text-gray-400">+91 98765 43210</span></li>
              <li className="flex items-center gap-3"><FiMail className="text-primary-400 shrink-0" /><span className="text-sm text-gray-400">info@gramsampan.com</span></li>
            </ul>
          </motion.div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Gram Sampan Agro Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-primary-400">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-primary-400">Terms</Link>
            <Link to="/register?role=admin" className="text-sm text-yellow-500 hover:text-yellow-400">Admin Registration</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
