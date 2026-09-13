import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import questionsData from '../data/questions.json'

export default function ExamResultReview({ attempt, backUrl = '/history', backText = 'Quay lại lịch sử' }) {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all') // all, correct, partial, wrong, unanswered
  
  if (!attempt) return <div className="p-8 text-center text-gray-400">Không tìm thấy dữ liệu bài thi.</div>
  
  const questions = questionsData.find(e => e.id === attempt.examId)?.questions || []
  if (!questions.length) return <div className="p-8 text-center text-gray-400">Không tìm thấy câu hỏi.</div>
  
  const details = Object.fromEntries(attempt.answers.map(a => [a.questionId, a]))
  
  const filteredQuestions = questions.filter(q => {
    if (filter === 'all') return true;
    const d = details[q.questionId] || {};
    const currentStatus = d.status || d.result || 'unanswered';
    return currentStatus === filter;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-12 max-w-5xl mx-auto w-full">
      
      {/* Result Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <button onClick={() => navigate(backUrl)} className="flex items-center gap-2 text-primary hover:underline font-medium">
          <ChevronLeft size={20} /> {backText}
        </button>
        <div className="text-left md:text-right">
          <h1 className="font-bold text-2xl mb-1">{attempt.examName}</h1>
          <p className="text-gray-400 text-sm">
            Điểm: <span className="font-bold text-white">{attempt.score.toFixed(1)}/10</span> &bull; Thời gian làm: <span className="font-bold text-white">{Math.floor(attempt.duration / 60)} phút {attempt.duration % 60} giây</span>
          </p>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-5 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-success mb-1">{attempt.correct}</span>
          <span className="text-sm text-gray-400">✅ Câu đúng</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-warning mb-1">{attempt.answers.filter(a => a.status === 'partial').length || 0}</span>
          <span className="text-sm text-gray-400">🟡 Đúng một phần</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-danger mb-1">{attempt.wrong}</span>
          <span className="text-sm text-gray-400">❌ Câu sai</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-gray-400 mb-1">{attempt.unanswered}</span>
          <span className="text-sm text-gray-400">⚪ Bỏ trống</span>
        </div>
      </div>

      {/* Question Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <FilterTab label="Tất cả" value="all" current={filter} setFilter={setFilter} />
        <FilterTab label="✅ Đúng" value="correct" current={filter} setFilter={setFilter} />
        <FilterTab label="🟡 Đúng một phần" value="partial" current={filter} setFilter={setFilter} />
        <FilterTab label="❌ Sai" value="wrong" current={filter} setFilter={setFilter} />
        <FilterTab label="⚪ Bỏ trống" value="unanswered" current={filter} setFilter={setFilter} />
      </div>

      {/* Question Detail Cards */}
      <div className="space-y-6">
        {filteredQuestions.map((q) => { 
          const i = questions.findIndex(orig => orig.questionId === q.questionId);
          const d = details[q.questionId] || {}; 
          const isMcq = q.type === 'mcq' || !q.type;
          
          let selectedText = d.selected || '';
          let correctText = d.correct || q.correct;
          
          if (isMcq && q.answers) {
             const sel = q.answers.find(a => a.startsWith((d.selected || '') + '.'));
             if (sel) selectedText = sel;
             const cor = q.answers.find(a => a.startsWith(q.correct + '.'));
             if (cor) correctText = cor;
          }
          
          const currentStatus = d.status || d.result || 'unanswered';
          const statusText = currentStatus === 'correct' ? 'Đúng' : currentStatus === 'partial' ? 'Đúng một phần' : currentStatus === 'wrong' ? 'Sai' : 'Bỏ trống';
          const tone = currentStatus === 'correct' ? 'success' : currentStatus === 'partial' ? 'warning' : currentStatus === 'wrong' ? 'danger' : 'gray-400';
          
          return (
            <Card 
              key={q.questionId} 
              index={i} 
              q={q} 
              d={d} 
              status={statusText} 
              currentStatus={currentStatus}
              selected={selectedText || 'Chưa trả lời'} 
              correct={correctText} 
              tone={tone}
            />
          );
        })}
        {filteredQuestions.length === 0 && (
          <div className="text-center p-8 text-gray-400 glass-panel rounded-2xl">
            Không có câu hỏi nào trong mục này.
          </div>
        )}
      </div>
    </motion.div>
  )
}

function FilterTab({ label, value, current, setFilter }) {
  const active = current === value;
  return (
    <button 
      onClick={() => setFilter(value)}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors border ${
        active 
          ? 'bg-primary/20 text-white border-primary/50' 
          : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}

function Card({index, q, d, status, currentStatus, selected, correct, tone}) { 
  const isCorrect = currentStatus === 'correct' || currentStatus === 'partial';
  const isUnanswered = currentStatus === 'unanswered';
  const userAnsClass = isUnanswered ? 'bg-white/5 border-white/10 text-gray-400' : 
                       isCorrect ? 'bg-success/10 border-success/30 text-success' : 
                       'bg-danger/10 border-danger/30 text-danger';

  return (
    <article className={`glass-panel p-6 rounded-3xl border-l-4 border-l-${tone === 'gray-400' ? 'gray-500' : tone}`}>
      <p className={`font-bold mb-3 text-${tone}`}>Câu {index + 1} · {status === 'Đúng' ? '✅ Đúng' : status === 'Đúng một phần' ? '🟡 Đúng một phần' : status === 'Sai' ? '❌ Sai' : '⚪ Bỏ trống'}</p>
      <h2 className="font-bold leading-relaxed mb-6 whitespace-pre-wrap">{q.question}</h2>
      
      <div className={`p-4 rounded-xl border ${userAnsClass} mb-3`}>
        <p className="text-xs opacity-70 mb-2 uppercase tracking-wider font-semibold">BẠN TRẢ LỜI</p>
        <p className="whitespace-pre-wrap">{selected}</p>
      </div>

      {q.type === 'text' && d?.targetKeywords?.length > 0 && (
        <div className="mb-3 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">Từ khóa đạt được ({d.achievedKeywords?.length || 0}/{d.targetKeywords.length})</p>
          <div className="flex flex-wrap gap-2">
            {d.targetKeywords.map((kw, idx) => { 
              const achieved = d.achievedKeywords?.includes(kw); 
              return (
                <span key={idx} className={`px-2 py-1 text-sm rounded-md ${achieved ? 'bg-success/20 text-success border border-success/30' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
                  {kw}
                </span> 
              )
            })}
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl bg-success/10 border border-success/30 text-success">
        <p className="text-xs opacity-70 mb-2 uppercase tracking-wider font-semibold">ĐÁP ÁN ĐÚNG / THAM KHẢO</p>
        <p className="whitespace-pre-wrap">{correct}</p>
      </div>
    </article> 
  ) 
}

