import { motion } from 'framer-motion';
import { FiUserPlus, FiUsers, FiShield, FiPackage, FiLayers, FiMap, FiFileText, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const services = [
  { icon: FiUserPlus, title: 'Farmer Registration', desc: 'Complete digital registration for farmers. Manage personal information, crop details, land records, and farm photos all in one place.', features: ['Digital Profile Management', 'Crop Information Tracking', 'Photo Uploads', 'Income Tracking'] },
  { icon: FiUsers, title: 'Mahila Bachat Gath Registration', desc: 'Comprehensive SHG management platform for self-help groups to register and manage their operations.', features: ['Group Profile', 'Member Management', 'Product Catalog', 'Machine Inventory'] },
  { icon: FiShield, title: 'CRP Management', desc: 'Empower Community Resource Persons with tools to manage farmers and SHGs in their assigned villages.', features: ['Village Assignment', 'Data Verification', 'Approval Workflow', 'Field Reports'] },
  { icon: FiPackage, title: 'Product Collection', desc: 'Efficient product collection system for agricultural and homemade products from farmers and SHGs.', features: ['Product Listing', 'Category Management', 'Quality Checks', 'Procurement Tracking'] },
  { icon: FiLayers, title: 'Stock Management', desc: 'Real-time inventory management to track available stock, quantities, and procurement status.', features: ['Real-time Tracking', 'Stock Alerts', 'Category-wise Stock', 'Historical Data'] },
  { icon: FiMap, title: 'Village Data', desc: 'Comprehensive village-level data collection and analytics for informed rural development planning.', features: ['Demographic Data', 'Agricultural Data', 'Infrastructure Data', 'Trend Analysis'] },
  { icon: FiFileText, title: 'Reports', desc: 'Generate detailed reports in PDF, Excel, and CSV formats for various stakeholders.', features: ['Monthly Reports', 'Village Reports', 'Crop Reports', 'Income Reports'] },
  { icon: FiBarChart2, title: 'Analytics', desc: 'Data-driven analytics and insights for better agricultural and business decision making.', features: ['Interactive Charts', 'Trend Analysis', 'Performance Metrics', 'Export Options'] },
];

export default function Services() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold mb-4">Our Services</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-green-200 max-w-3xl mx-auto">Comprehensive digital solutions for agricultural management and rural development.</motion.p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card group hover:border-primary-200 dark:hover:border-primary-800">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-green-50 dark:from-primary-900/30 dark:to-green-900/30 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <service.icon className="text-primary-600 dark:text-primary-400" size={28} />
                  </div>
                  <div><h3 className="text-xl font-bold text-gray-900 dark:text-white">{service.title}</h3><p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{service.desc}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {service.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />{f}</div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary-600 to-green-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Need a Custom Solution?</h2>
            <p className="text-xl text-green-100 mb-8">Contact us for tailored services specific to your village or organization.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-green-50 transition-all">Contact Us <FiArrowRight /></Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
