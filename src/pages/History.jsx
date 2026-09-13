import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Clock, Eye, History as HistoryIcon } from 'lucide-react'
import { getExamHistory } from '../services/historyService'

export default function History() {
  const history = getExamHistory()
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 lg:p-12 max-w-5xl mx-auto w-full"><div className="mb-8"><h1 className="text-3xl font-heading font-bold flex items-center gap-3"><HistoryIcon className="text-primary" /> Lịch sử thi</h1><p className="text-gray-400 mt-2">Các kết quả được lưu cục bộ trên trình duyệt này.</p></div><div className="space-y-4">{history.map(item => <div key={item.id} className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/50 hover:-translate-y-0.5 transition-all"><div><h2 className="font-heading font-bold text-lg">{item.examName}</h2><div className="text-sm text-gray-400 mt-2 flex gap-4 flex-wrap"><span>{new Date(item.finishedAt).toLocaleString('vi-VN')}</span><span>{item.correct} đúng</span><span>{item.wrong} sai</span><span>{item.unanswered} chưa làm</span></div></div><div className="flex items-center gap-4"><div className="text-right"><div className="font-bold text-success text-xl">{item.score.toFixed(1)}/10</div><div className="text-xs text-gray-400 flex items-center gap-1"><Clock size={13} /> {Math.floor(item.duration / 60)} phút</div></div><Link to={`/history/${item.id}`} className="btn-glass px-4 py-3 flex items-center gap-2"><Eye size={19} /> Xem chi tiết</Link></div></div>)}{!history.length && <div className="glass-panel p-10 rounded-3xl text-center text-gray-400">Chưa có lịch sử thi. Hãy hoàn thành một đề để xem kết quả tại đây.</div>}</div></motion.div>
}
