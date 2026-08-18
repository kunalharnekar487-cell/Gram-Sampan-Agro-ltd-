import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent successfully! We will get back to you soon.');
    setForm({ name: '', email: '', mobile: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold mb-4">Contact Us</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-green-200">Get in touch with Gram Sampan Agro Ltd</motion.p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="input-field" />
                  <input type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="tel" placeholder="Mobile Number" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} required className="input-field" />
                  <input type="text" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required className="input-field" />
                </div>
                <textarea rows={5} placeholder="Your Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required className="input-field resize-none" />
                <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2"><FiSend /> {loading ? 'Sending...' : 'Send Message'}</button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
              {[
                { icon: FiMapPin, label: 'Address', value: 'Gram Sampan Agro Ltd, Partner: Raigad Agro Solution, Maharashtra, India' },
                { icon: FiPhone, label: 'Phone', value: '+91 98765 43210' },
                { icon: FiMail, label: 'Email', value: 'info@gramsampan.com' },
                { icon: FiClock, label: 'Working Hours', value: 'Mon - Sat: 9:00 AM - 6:00 PM' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50"><item.icon className="text-primary-600 dark:text-primary-400 mt-1 shrink-0" size={24} /><div><h3 className="font-semibold text-gray-900 dark:text-white">{item.label}</h3><p className="text-gray-500 dark:text-gray-400">{item.value}</p></div></div>
              ))}
              <div className="h-64 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400"><FiMapPin size={32} /><span className="ml-2">Map Location</span></div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
