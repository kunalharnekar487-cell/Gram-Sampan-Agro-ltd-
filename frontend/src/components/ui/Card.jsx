import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, glow = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`card ${glow ? 'shadow-primary-500/10 dark:shadow-primary-500/5' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
