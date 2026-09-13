import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, Clock, Target, Flame, Activity, History } from 'lucide-react'
import { calculateStatistics, getExamHistory, getWeeklyActivity } from '../services/historyService'

export default function Dashboard() {
  const history = useMemo(getExamHistory, [])
  const stats = calculateStatistics(history)
  const weekly = getWeeklyActivity(history)
  const max = Math.max(1, ...weekly.map(day => day.count))
  const cards = [
    { icon: CheckCircle, value: `${stats.completedExams} / ${stats.totalExams}`, label: 'Đề đã làm', color: 'text-primary', bg: 'bg-primary/20' },
    { icon: Target, value: stats.averageScore.toFixed(1), label: 'Điểm trung bình', color: 'text-success', bg: 'bg-success/20' },
    { icon: Activity, value: `${stats.progress}%`, label: `Tiến độ · ${stats.completedQuestions}/${stats.totalQuestions} câu`, color: 'text-cyan', bg: 'bg-cyan/20' },
    { icon: Flame, value: `${stats.streak} ngày`, label: 'Chuỗi học liên tục', color: 'text-warning', bg: 'bg-warning/20' }
  ]
  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6 lg:p-12 max-w-7xl mx-auto w-full space-y-10">
    <div className="glass-panel p-8 rounded-[32px] bg-gradient-to-r from-card to-secondary relative overflow-hidden"><div className="absolute right-0 top-0 w-1/2 h-full bg-premium-gradient opacity-10 blur-3xl" /><h1 className="text-3xl lg:text-4xl font-heading font-bold mb-2">Tiến độ học tập</h1><p className="text-gray-400">Dữ liệu được tính từ các lần nộp bài trên thiết bị này.</p></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">{cards.map(({ icon: Icon, ...stat }) => <div key={stat.label} className="glass-panel p-5 rounded-3xl flex flex-col items-center justify-center text-center"><div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}><Icon size={24} /></div><div className="text-2xl font-heading font-bold">{stat.value}</div><div className="text-sm text-gray-400 mt-1">{stat.label}</div></div>)}</div>
    <div className="grid lg:grid-cols-3 gap-8"><div className="lg:col-span-2 glass-panel p-8 rounded-[32px]"><h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2"><Activity className="text-primary" /> Hoạt động 7 ngày gần đây</h2><div className="h-48 border-b border-l border-white/10 flex items-end justify-between gap-3 px-4 pb-4">{weekly.map(day => <div key={day.date} className="h-full flex-1 flex items-end justify-center group"><div title={`${day.count} bài`} className="w-full max-w-[40px] min-h-[3px] bg-primary/30 group-hover:bg-primary rounded-t-lg transition-all" style={{ height: `${(day.count / max) * 100}%` }} /></div>)}</div><div className="flex justify-between px-4 mt-2 text-xs text-gray-500 font-bold">{weekly.map(day => <span key={day.date}>{day.label}</span>)}</div></div>
      <div className="glass-panel p-8 rounded-[32px]"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-heading font-bold flex items-center gap-2"><Clock className="text-cyan" /> Làm gần đây</h2><Link to="/history" className="text-sm text-primary hover:underline">Xem tất cả</Link></div><div className="space-y-3">{history.slice(0, 4).map(item => <Link to={`/history/${item.id}`} key={item.id} className="block p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/40 transition-colors"><div className="font-bold text-sm truncate">{item.examName}</div><div className="flex justify-between mt-2 text-xs text-gray-400"><span>{new Date(item.finishedAt).toLocaleDateString('vi-VN')}</span><span className="text-success font-bold">{item.score.toFixed(1)}/10</span></div></Link>)}{!history.length && <p className="text-sm text-gray-400">Chưa có bài thi nào được nộp.</p>}</div><Link to="/history" className="mt-5 btn-glass w-full py-3 flex items-center justify-center gap-2"><History size={18} /> Lịch sử thi</Link></div></div>
  </motion.div>
}
