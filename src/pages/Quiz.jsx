import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Clock, Pause, ChevronLeft, ChevronRight, CheckCircle2, Grip, X } from 'lucide-react'

export default function Quiz() {
  const navigate = useNavigate()
  const { activeExam, questions, answers, setAnswer, submitExam, timeLimit, startTime, currentQuestionIndex, setCurrentQuestionIndex } = useStore()
  
  const currentIndex = currentQuestionIndex
  const setCurrentIndex = setCurrentQuestionIndex
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60)
  const [showMobileNav, setShowMobileNav] = useState(false)

  useEffect(() => {
    if (timeLimit === 0) return
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = (timeLimit * 60) - elapsed
      if (remaining <= 0) {
        clearInterval(timer)
        handleSubmit()
      } else {
        setTimeLeft(remaining)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [startTime, timeLimit])

  if (!activeExam) return null

  const q = questions[currentIndex]

  const handleSubmit = () => {
    submitExam()
    navigate('/result')
  }

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const NavigatorGrid = () => (
    <div className="grid grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-2 p-4">
      {questions.map((q, idx) => {
        const isAnswered = !!answers[q.questionId]
        const isCurrent = idx === currentIndex
        return (
          <button
            key={q.questionId}
            onClick={() => { setCurrentIndex(idx); setShowMobileNav(false); }}
            className={`aspect-square rounded-xl flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
              isCurrent ? 'bg-warning text-white ring-2 ring-warning/50 ring-offset-2 ring-offset-background' :
              isAnswered ? 'bg-primary/20 text-primary border border-primary/30' : 
              'bg-white/5 text-gray-500 hover:bg-white/10 border border-white/5'
            }`}
          >
            {idx + 1}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      {/* Top Header */}
      <header className="sticky top-0 glass-panel border-x-0 border-t-0 px-4 md:px-8 py-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-indigo flex items-center justify-center font-bold shadow-lg">
            {activeExam.id}
          </div>
          <div className="hidden sm:block">
            <div className="font-heading font-bold">Ôn Thi Pro</div>
            <div className="text-xs text-gray-400">{activeExam.title}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full font-mono text-lg font-bold">
            <Clock size={18} className={timeLeft < 300 ? 'text-danger animate-pulse' : 'text-cyan'} />
            <span className={timeLeft < 300 ? 'text-danger' : ''}>{formatTime(timeLeft)}</span>
          </div>
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-gray-400 transition-colors">
            <Pause size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Left: Question Area (75%) */}
        <main className="flex-1 pb-24 md:pb-6 relative scroll-smooth">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-6">
                Câu {currentIndex + 1} / {questions.length}
              </div>

              <div className="glass-panel p-6 md:p-10 rounded-[32px] mb-8">
                <h3 className="text-xl md:text-2xl font-heading font-bold leading-relaxed mb-8 text-white/90">
                  {q.question}
                </h3>

                {q.passage && (
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/10 mb-8 text-gray-300 leading-relaxed italic">
                    {q.passage}
                  </div>
                )}

                  {(!q.type || q.type === 'mcq') && (
                    <div className="space-y-4">
                      {q.answers?.map((ans, i) => {
                        const isSelected = answers[q.questionId] === ans
                        return (
                          <button
                            key={i}
                            onClick={() => setAnswer(q.questionId, ans)}
                            className={`w-full text-left p-5 md:p-6 rounded-2xl border transition-all duration-200 ${
                              isSelected 
                                ? 'bg-primary/10 border-primary glow-primary text-white scale-[1.01]' 
                                : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300 hover:text-white'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-gray-500'}`}>
                                {isSelected && <div className="w-3 h-3 bg-primary rounded-full" />}
                              </div>
                              <span className="leading-relaxed">{ans}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {q.type === 'sequence' && (
                    <div className="space-y-3">
                      <label htmlFor={`answer-${q.questionId}`} className="block font-bold text-gray-200">Nhập thứ tự (VD: 3-1-2-4)</label>
                      <input 
                        type="text"
                        id={`answer-${q.questionId}`} 
                        value={answers[q.questionId] || ''} 
                        onChange={(event) => setAnswer(q.questionId, event.target.value)} 
                        placeholder="VD: 3-1-2-4" 
                        className="w-full rounded-2xl border border-white/15 bg-white/5 p-4 text-xl font-mono text-center tracking-[0.2em] text-white placeholder:text-gray-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30" 
                      />
                      <p className="text-sm text-center text-gray-400">Nhập các số tương ứng với cụm từ, cách nhau bằng dấu gạch ngang.</p>
                    </div>
                  )}

                  {q.type === 'text' && (
                    <div className="space-y-3">
                      <label htmlFor={`answer-${q.questionId}`} className="block font-bold text-gray-200">Nhập câu trả lời tự luận</label>
                      <textarea 
                        id={`answer-${q.questionId}`} 
                        value={answers[q.questionId] || ''} 
                        onChange={(event) => setAnswer(q.questionId, event.target.value)} 
                        rows={8} 
                        placeholder="Nhập câu trả lời chi tiết tại đây..." 
                        className="w-full min-h-[180px] resize-y rounded-2xl border border-white/15 bg-white/5 p-4 text-base leading-relaxed text-white placeholder:text-gray-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30" 
                      />
                      <p className="text-sm text-warning">Câu tự luận được lưu tự động nhưng chưa tính điểm. Kết quả cần chấm thủ công.</p>
                    </div>
                  )}
              </div>

              <div className="flex justify-between items-center hidden md:flex">
                <button 
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl disabled:opacity-30 flex items-center gap-2 hover:bg-white/10 font-bold transition-colors"
                >
                  <ChevronLeft size={20} /> Trước
                </button>
                {currentIndex === questions.length - 1 ? (
                  <button 
                    onClick={() => { if (confirm("Nộp bài?")) handleSubmit() }}
                    className="px-8 py-3 bg-success hover:bg-success/80 text-white rounded-xl flex items-center gap-2 font-bold transition-colors shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                  >
                    <CheckCircle2 size={20} /> Nộp bài
                  </button>
                ) : (
                  <button 
                    onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                    className="px-8 py-3 bg-white text-background rounded-xl flex items-center gap-2 font-bold hover:bg-gray-200 transition-colors"
                  >
                    Tiếp <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </main>

        {/* Right: Navigator (25%) */}
        <aside className="hidden md:flex w-80 lg:w-96 glass-panel border-y-0 border-r-0 flex-col z-10">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-heading font-bold text-lg">Bảng câu hỏi</h3>
            <span className="text-sm font-bold px-2 py-1 bg-primary/20 text-primary rounded-lg">{Object.keys(answers).length}/{questions.length}</span>
          </div>
          <div className="flex-1">
            <NavigatorGrid />
          </div>
          <div className="p-6 border-t border-white/10">
            <button 
              onClick={() => { if (confirm("Bạn có chắc chắn muốn nộp bài?")) handleSubmit() }}
              className="w-full py-4 rounded-xl font-bold bg-success/20 text-success border border-success/30 hover:bg-success hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={20} /> Nộp bài ngay
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Navigation & Sheet */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <AnimatePresence>
          {showMobileNav && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowMobileNav(false)}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              />
              <motion.div 
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-20 left-0 right-0 glass-panel rounded-t-3xl border-b-0 z-50 overflow-hidden max-h-[70vh] flex flex-col"
              >
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-card">
                  <span className="font-bold">Chuyển câu nhanh</span>
                  <button onClick={() => setShowMobileNav(false)} className="p-2 bg-white/10 rounded-full"><X size={18}/></button>
                </div>
                <div className="overflow-y-auto p-2 pb-8 bg-background">
                  <NavigatorGrid />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="glass-panel border-x-0 border-b-0 px-4 py-3 pb-safe flex justify-between items-center bg-card/95">
          <button 
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="p-3 bg-white/5 rounded-xl disabled:opacity-30"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={() => setShowMobileNav(true)}
            className="px-6 py-3 bg-white/10 rounded-xl font-bold flex items-center gap-2"
          >
            <Grip size={20} /> {currentIndex + 1}/{questions.length}
          </button>

          {currentIndex === questions.length - 1 ? (
            <button onClick={() => { if (confirm("Nộp bài?")) handleSubmit() }} className="p-3 bg-success rounded-xl text-white">
              <CheckCircle2 size={24} />
            </button>
          ) : (
            <button onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))} className="p-3 bg-primary rounded-xl text-white">
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
