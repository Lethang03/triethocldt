import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { ChevronLeft, Play, Settings2, Clock, Shuffle } from 'lucide-react'
import questionsData from '../data/questions.json'
import examMeta from '../data/examMeta.json'

export default function ExamSetup() {
  const navigate = useNavigate()
  const { id } = useParams()
  const setupExam = useStore(s => s.setupExam)
  const savedSession = useStore(s => s)
  
  const [exam, setExam] = useState(null)
  const [mode, setMode] = useState('practice')
  const [timeLimit, setTimeLimit] = useState(90)
  const [shuffleQuestions, setShuffleQuestions] = useState(true)
  const [shuffleAnswers, setShuffleAnswers] = useState(true)

  useEffect(() => {
    const metadata = examMeta.find(e => e.id === id)
    const questionBank = questionsData.find(e => e.id === id)
    if (metadata) setExam({ ...metadata, ...questionBank, questions: questionBank?.questions ?? [] })
    else if (questionsData.length) setExam(questionsData[0])
  }, [id])

  const handleStart = () => {
    if (!exam) return

    let questions = [...exam.questions]
    if (shuffleQuestions) questions.sort(() => Math.random() - 0.5)

    if (shuffleAnswers) {
      questions = questions.map(q => {
        if (!q.answers) return q;
        const ans = [...q.answers].sort(() => Math.random() - 0.5)
        return { ...q, answers: ans }
      })
    }

    setupExam({
      activeExam: exam, mode, timeLimit, shuffleQuestions, shuffleAnswers, questions
    })
    
    navigate('/quiz')
  }

  if (!exam) return null
  const hasQuestions = exam.questions.length > 0
  const canResume = savedSession.activeExam?.id === id && !savedSession.endTime && savedSession.questions.length > 0

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12"
    >
      <div className="w-full max-w-3xl">
        <button onClick={() => navigate('/exams')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ChevronLeft size={20} /> Quay lại danh sách
        </button>

        <div className="glass-panel p-8 md:p-12 rounded-[40px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center font-bold text-2xl shadow-lg">
              {exam.id}
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold">{exam.title}</h2>
              <div className="text-gray-400 mt-1">{exam.questions?.length} câu hỏi</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Left Col: Mode */}
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-xl flex items-center gap-2">
                <Settings2 className="text-cyan" /> Chế độ làm bài
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <button onClick={() => setMode('practice')} className={`p-5 rounded-2xl border text-left transition-all ${mode === 'practice' ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                  <div className="font-bold text-lg mb-1">Luyện tập</div>
                  <div className="text-sm text-gray-400">Xem đáp án sau khi nộp, hiển thị giải thích chi tiết.</div>
                </button>
                <button onClick={() => setMode('exam')} className={`p-5 rounded-2xl border text-left transition-all ${mode === 'exam' ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                  <div className="font-bold text-lg mb-1">Thi thử</div>
                  <div className="text-sm text-gray-400">Chấm điểm gắt gao, thời gian đếm ngược chính xác.</div>
                </button>
              </div>
            </div>

            {/* Right Col: Settings */}
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-xl flex items-center gap-2">
                <Settings2 className="text-indigo" /> Cấu hình
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg"><Clock size={20} className="text-cyan"/></div>
                    <span className="font-medium">Thời gian</span>
                  </div>
                  <select 
                    value={timeLimit} 
                    onChange={e => setTimeLimit(Number(e.target.value))}
                    className="bg-transparent text-right outline-none font-bold text-primary appearance-none cursor-pointer"
                  >
                    <option value={45} className="bg-card">45 Phút</option>
                    <option value={60} className="bg-card">60 Phút</option>
                    <option value={90} className="bg-card">90 Phút</option>
                    <option value={120} className="bg-card">120 Phút</option>
                  </select>
                </div>

                <label className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg"><Shuffle size={20} className="text-primary"/></div>
                    <span className="font-medium">Trộn câu hỏi</span>
                  </div>
                  <input type="checkbox" checked={shuffleQuestions} onChange={e => setShuffleQuestions(e.target.checked)} className="w-5 h-5 accent-primary" />
                </label>

                <label className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg"><Shuffle size={20} className="text-indigo"/></div>
                    <span className="font-medium">Trộn đáp án</span>
                  </div>
                  <input type="checkbox" checked={shuffleAnswers} onChange={e => setShuffleAnswers(e.target.checked)} className="w-5 h-5 accent-primary" />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            {canResume && <div className="mb-5 rounded-2xl border border-warning/30 bg-warning/10 p-5"><h3 className="font-bold text-warning">Bài thi đang làm dở</h3><p className="text-sm text-gray-300 mt-1">Đã làm {Object.keys(savedSession.answers).length}/{savedSession.questions.length} câu · còn {Math.max(0, Math.ceil((savedSession.timeLimit * 60 - (Date.now() - savedSession.startTime) / 1000) / 60))} phút</p><div className="mt-4 flex gap-3"><button onClick={() => navigate('/quiz')} className="btn-premium px-5 py-3">Tiếp tục làm bài</button><button onClick={handleStart} className="btn-glass px-5 py-3">Làm lại từ đầu</button></div></div>}
            <button 
              onClick={handleStart}
              disabled={!hasQuestions}
              className="w-full btn-premium py-5 text-xl flex justify-center items-center gap-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play fill="currentColor" size={24} /> Bắt đầu làm bài
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
