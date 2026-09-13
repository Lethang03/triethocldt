import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileText, Clock, ChevronRight } from 'lucide-react'

export default function ExamCard({ exam }) {
  const status = 'Chưa làm'
  const statusColors = {
    'Chưa làm': 'text-gray-300 bg-gray-500/10 border-gray-500/20',
    'Đang thực hiện': 'text-warning bg-warning/10 border-warning/20',
    'Hoàn thành': 'text-success bg-success/10 border-success/20'
  }
  const actionText = {
    'Chưa làm': 'Bắt đầu',
    'Đang thực hiện': 'Tiếp tục',
    'Hoàn thành': 'Xem lại'
  }

  return (
    <motion.article
      whileHover={{ y: -5, scale: 1.015 }}
      transition={{ duration: 0.2 }}
      className="glass-panel min-w-0 p-5 sm:p-6 rounded-3xl relative group transition-all duration-300 hover:shadow-[0_12px_42px_rgba(37,99,235,0.24)] hover:border-primary/60"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start gap-3 mb-6">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            {String(exam.id).padStart(2, '0')}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${statusColors[status]}`}>
            {status}
          </span>
        </div>

        <h3 className="font-heading font-bold text-xl mb-4 group-hover:text-primary transition-colors">{exam.title}</h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 mb-8">
          <div className="flex items-center gap-1.5 whitespace-nowrap"><FileText size={16} /> {exam.questions?.length || exam.questionCount || 60} câu hỏi</div>
          <div className="flex items-center gap-1.5 whitespace-nowrap"><Clock size={16} /> {exam.duration || 90} phút</div>
        </div>

        <Link to={`/setup/${exam.id}`} className="mt-auto w-full py-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 font-bold group-hover:bg-primary group-hover:border-primary transition-colors">
          {actionText[status]} <ChevronRight size={18} />
        </Link>
      </div>
    </motion.article>
  )
}
