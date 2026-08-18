import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiUsers, FiHome, FiBarChart2, FiHeart, FiTrendingUp, FiStar, FiChevronDown, FiUserPlus, FiShield, FiPackage, FiMap, FiFileText, FiLayers } from 'react-icons/fi';
import CountUp from '../../components/charts/CountUp';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const services = [
  { icon: FiUserPlus, title: 'Farmer Registration', desc: 'Digital registration for farmers with complete profile management' },
  { icon: FiUsers, title: 'Mahila Bachat Gath', desc: 'SHG registration and management platform' },
  { icon: FiShield, title: 'CRP Management', desc: 'Community Resource Person management system' },
  { icon: FiPackage, title: 'Product Collection', desc: 'Collect agricultural and homemade products efficiently' },
  { icon: FiLayers, title: 'Stock Management', desc: 'Real-time inventory and stock tracking' },
  { icon: FiMap, title: 'Village Data', desc: 'Comprehensive village-level data analytics' },
  { icon: FiFileText, title: 'Reports', desc: 'Generate detailed reports and analytics' },
  { icon: FiBarChart2, title: 'Analytics', desc: 'Data-driven insights for better decision making' },
];

const steps = [
  { num: '01', title: 'Register', desc: 'Create your account as Farmer, SHG, or CRP Tai' },
  { num: '02', title: 'Fill Information', desc: 'Complete your profile with detailed information' },
  { num: '03', title: 'Verification', desc: 'Data verified by CRP Tai for authenticity' },
  { num: '04', title: 'Products Listed', desc: 'Your products are listed on the platform' },
  { num: '05', title: 'Procurement', desc: 'Raigad Agro Solution procures your products' },
];

const benefits = [
  { icon: FiCheckCircle, title: 'Digital Records', desc: 'Replace paper forms with secure digital records' },
  { icon: FiTrendingUp, title: 'Better Market Access', desc: 'Connect directly with buyers and markets' },
  { icon: FiHeart, title: 'Women Empowerment', desc: 'Empower women through SHG digital inclusion' },
  { icon: FiHome, title: 'Village Development', desc: 'Data-driven rural development planning' },
  { icon: FiStar, title: 'Farmer Growth', desc: 'Access to resources, training, and support' },
  { icon: FiUsers, title: 'Easy Management', desc: 'Streamlined management for all stakeholders' },
];

const testimonials = [
  { name: 'Ramesh Patil', role: 'Farmer, Satara', quote: 'This platform has transformed how I manage my farm data. Now I can easily connect with buyers.' },
  { name: 'Sunita Devi', role: 'Mahila Group Head', desc: 'Our SHG has grown tremendously. Digital records help us track everything.' },
  { name: 'Kavita Tai', role: 'CRP Tai, Raigad', quote: 'Managing village data is now so easy. The digital forms save so much time.' },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary-900 via-primary-800 to-green-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-green-200 text-sm font-medium mb-6">Digital India Initiative for Agriculture</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Empowering Farmers,<br />
              <span className="text-green-300">Strengthening Rural Communities</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-10">
              Digital Platform connecting Farmers, Mahila Bachat Gath and Raigad Agro Solution for sustainable agricultural growth.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">Get Started <FiArrowRight /></Link>
              <Link to="/about" className="btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">Learn More</Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <FiChevronDown className="text-white/50 animate-bounce" size={32} />
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="section-title">About Gram Sampan Agro Ltd</h2>
            <p className="section-subtitle max-w-3xl mx-auto">Partnering with Raigad Agro Solution to revolutionize agricultural data management</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Our Mission', desc: 'To digitally empower every farmer and self-help group in rural India with modern data management tools.' },
              { title: 'Our Vision', desc: 'A self-reliant rural ecosystem where every farmer and SHG has access to digital infrastructure and market opportunities.' },
              { title: 'Our Objectives', desc: 'Replace paper forms, enable data-driven decisions, improve market access, and foster rural development.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card text-center hover:border-primary-200 dark:hover:border-primary-800">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-green-50 dark:from-primary-900/40 dark:to-green-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-0.5 bg-primary-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">Comprehensive digital solutions for agricultural management</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card group hover:border-primary-200 dark:hover:border-primary-800 cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-green-50 dark:from-primary-900/40 dark:to-green-900/40 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="text-primary-600 dark:text-primary-400" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Simple 5-step process to get started</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
                  <span className="text-white font-bold text-lg">{step.num}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[calc(80%)] h-0.5 bg-gradient-to-r from-primary-300 to-primary-500">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary-500 rounded-full" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="section-title">Benefits</h2>
            <p className="section-subtitle">Why choose Gram Sampan Agro Ltd</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex gap-4 card">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center shrink-0"><benefit.icon className="text-green-600 dark:text-green-400" size={24} /></div>
                <div><h3 className="font-semibold text-gray-900 dark:text-white mb-1">{benefit.title}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{benefit.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-24 bg-gradient-to-r from-primary-900 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: FiUsers, label: 'Farmers', value: 12500 },
              { icon: FiHeart, label: 'Mahila Groups', value: 850 },
              { icon: FiMap, label: 'Villages', value: 450 },
              { icon: FiPackage, label: 'Products Listed', value: 28000 },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4"><stat.icon size={32} /></div>
                <p className="text-4xl font-bold mb-1"><CountUp end={stat.value} /></p>
                <p className="text-green-200">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="section-title">What People Say</h2>
            <p className="section-subtitle">Testimonials from our community</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card relative">
                <div className="absolute top-4 right-4 text-primary-200 dark:text-primary-800"><FiStar size={24} /></div>
                <p className="text-gray-600 dark:text-gray-400 italic mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold">{t.name.charAt(0)}</div>
                  <div><p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p><p className="text-xs text-gray-500">{t.role}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-green-100 mb-10">Join thousands of farmers and SHGs already on our platform.</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-green-50 transform hover:scale-105 transition-all shadow-xl">Register Now <FiArrowRight /></Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
