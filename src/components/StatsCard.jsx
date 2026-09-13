import { motion } from 'framer-motion'

export default function StatsCard({ icon: Icon, value, label, delay = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="glass-panel min-h-[116px] p-5 sm:p-6 rounded-3xl flex items-center gap-5 hover:bg-white/5 hover:border-primary/30 transition-[background-color,border-color,box-shadow] duration-300 group cursor-default"
    >
      <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-primary/20 to-indigo/20 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon className="text-primary w-7 h-7" />
      </div>
      <div>
        <div className="text-3xl font-heading font-extrabold text-white">{value}</div>
        <div className="text-gray-400 font-medium text-sm mt-1">{label}</div>
      </div>
    </motion.div>
  )
}
