import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { calculateAttempt, saveExamResult } from '../services/historyService'
import { Home, Eye, RotateCcw, Clock, CheckCircle, XCircle, AlertCircle, History } from 'lucide-react'

export default function Result() {
  const navigate = useNavigate()
  const state = useStore()
  const { activeExam, questions, answers, startTime, endTime, attemptId, reset } = state
  const attempt = useMemo(() => activeExam && questions.length ? calculateAttempt({ id: attemptId, exam: activeExam, questions, answers, startTime, endTime }) : null, [activeExam, questions, answers, startTime, endTime, attemptId])
  useEffect(() => { if (attempt) saveExamResult(attempt) }, [attempt])
  if (!attempt) return null
  const minutes = Math.floor(attempt.duration / 60)
  const seconds = attempt.duration % 60

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 p-6 lg:p-12 flex flex-col items-center max-w-6xl mx-auto w-full">
      <div className="w-full text-center mb-10"><h1 className="text-4xl font-heading font-bold mb-2">Hoàn thành bài thi!</h1><p className="text-gray-400 text-lg">{attempt.examName}</p></div>
      <div className="grid lg:grid-cols-2 gap-10 w-full mb-10">
        <div className="glass-panel p-10 rounded-[40px] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 blur-3xl" />
          <div className="relative w-60 h-60 rounded-full border-8 border-primary/20 flex flex-col items-center justify-center shadow-[0_0_35px_rgba(37,99,235,.35)]">
            <span className="text-6xl font-heading font-extrabold text-transparent bg-clip-text bg-premium-gradient">{attempt.score.toFixed(1)}</span><span className="text-gray-400 font-bold mt-2">/10 · {attempt.percentage}%</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Stat icon={CheckCircle} color="success" label="Câu đúng" value={attempt.correct} />
          <Stat icon={XCircle} color="danger" label="Câu sai" value={attempt.wrong} />
          <Stat icon={AlertCircle} color="warning" label="Chưa làm" value={attempt.unanswered} />
          <Stat icon={Clock} color="cyan" label="Thời gian" value={`${minutes}:${String(seconds).padStart(2, '0')}`} />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 justify-center w-full max-w-2xl">
        <button onClick={() => navigate(`/review?attempt=${attempt.id}`)} className="flex-1 min-w-[200px] btn-premium py-4 text-lg flex items-center justify-center gap-3"><Eye size={20} /> Xem lại đáp án</button>
        <button onClick={() => navigate('/history')} className="btn-glass py-4 px-6 flex items-center gap-2"><History size={20} /> Lịch sử</button>
        <button onClick={() => { reset(); navigate(`/setup/${attempt.examId}`) }} className="btn-glass py-4 px-6 flex items-center gap-2"><RotateCcw size={20} /> Làm lại</button>
        <button onClick={() => { reset(); navigate('/') }} className="btn-glass py-4 px-6 flex items-center gap-2"><Home size={20} /> Trang chủ</button>
      </div>
    </motion.div>
  )
}

function Stat({ icon: Icon, color, label, value }) {
  return <div className={`glass-panel p-6 rounded-3xl border-t-4 border-t-${color} flex flex-col justify-center`}><div className="flex items-center gap-3 mb-2 text-gray-400"><Icon size={20} className={`text-${color}`} /> {label}</div><div className="text-4xl font-heading font-bold">{value}</div></div>
}
