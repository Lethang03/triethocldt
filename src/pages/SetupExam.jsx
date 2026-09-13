import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { ChevronLeft, Play } from 'lucide-react'
import questionsData from '../data/questions.json'

export default function SetupExam() {
  const navigate = useNavigate()
  const setupExam = useStore(s => s.setupExam)
  
  const [selectedExam, setSelectedExam] = useState(questionsData[0]?.id || '')
  const [mode, setMode] = useState('practice')
  const [timeLimit, setTimeLimit] = useState(90)
  const [shuffleQuestions, setShuffleQuestions] = useState(false)
  const [shuffleAnswers, setShuffleAnswers] = useState(false)

  const handleStart = () => {
    let exam = questionsData.find(e => e.id === selectedExam)
    if (!exam) return

    let questions = [...exam.questions]
    if (shuffleQuestions) {
      questions.sort(() => Math.random() - 0.5)
    }

    if (shuffleAnswers) {
      questions = questions.map(q => {
        if (!q.answers) return q;
        const ans = [...q.answers].sort(() => Math.random() - 0.5)
        return { ...q, answers: ans }
      })
    }

    setupExam({
      activeExam: exam,
      mode,
      timeLimit,
      shuffleQuestions,
      shuffleAnswers,
      questions
    })
    
    navigate('/quiz')
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="min-h-screen p-6 max-w-4xl mx-auto flex flex-col justify-center"
    >
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 w-fit">
        <ChevronLeft size={20} /> Quay lại
      </button>

      <div className="glass-card p-8 rounded-3xl">
        <h2 className="text-3xl font-bold mb-8">Thiết lập bài làm</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3">Chọn bộ đề</label>
              <div className="h-64 overflow-y-auto pr-2 space-y-2">
                {questionsData.map(exam => (
                  <button
                    key={exam.id}
                    onClick={() => setSelectedExam(exam.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedExam === exam.id 
                        ? 'bg-primary/20 border border-primary text-primary-hover blue-glow' 
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold text-lg">{exam.title}</div>
                    <div className="text-sm text-gray-400">{exam.questions.length} câu hỏi</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3">Chế độ làm bài</label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setMode('practice')} className={`p-4 rounded-xl border ${mode === 'practice' ? 'bg-primary/20 border-primary text-primary-hover' : 'bg-white/5 border-white/10'}`}>Luyện tập</button>
                <button onClick={() => setMode('exam')} className={`p-4 rounded-xl border ${mode === 'exam' ? 'bg-primary/20 border-primary text-primary-hover' : 'bg-white/5 border-white/10'}`}>Thi thử</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3">Thời gian</label>
              <select 
                value={timeLimit} 
                onChange={e => setTimeLimit(Number(e.target.value))}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-primary"
              >
                <option value={45} className="bg-card">45 Phút</option>
                <option value={60} className="bg-card">60 Phút</option>
                <option value={90} className="bg-card">90 Phút</option>
                <option value={120} className="bg-card">120 Phút</option>
                <option value={0} className="bg-card">Không giới hạn</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer">
                <span>Trộn câu hỏi</span>
                <input type="checkbox" checked={shuffleQuestions} onChange={e => setShuffleQuestions(e.target.checked)} className="w-5 h-5 accent-primary" />
              </label>
              <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer">
                <span>Trộn đáp án</span>
                <input type="checkbox" checked={shuffleAnswers} onChange={e => setShuffleAnswers(e.target.checked)} className="w-5 h-5 accent-primary" />
              </label>
            </div>
            
            <button 
              onClick={handleStart}
              className="w-full p-4 rounded-xl bg-gradient-to-r from-gradient-start to-gradient-end font-bold text-lg flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform"
            >
              <Play fill="currentColor" size={20} /> Bắt đầu làm bài
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

