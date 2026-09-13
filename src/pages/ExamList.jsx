import { motion } from 'framer-motion'
import ExamCard from '../components/ExamCard'
import questionsData from '../data/questions.json'
import examMeta from '../data/examMeta.json'

export default function ExamList() {
  const exams = examMeta
    .map(meta => ({ ...meta, questions: questionsData.find(exam => exam.id === meta.id)?.questions ?? [] }))
    .sort((a, b) => Number(a.id) - Number(b.id))

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="p-6 lg:p-12 max-w-7xl mx-auto w-full"
    >
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-4xl font-heading font-bold mb-4">Danh sách đề thi</h1>
        <p className="text-gray-400 text-lg">Lựa chọn bộ đề phù hợp để bắt đầu luyện tập</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-6">
        {exams.map(exam => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </motion.div>
  )
}
