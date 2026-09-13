import { motion } from 'framer-motion'
import { ArrowRight, Play, BookOpen, Layers, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <div className="relative flex flex-row items-center justify-between min-h-[700px] py-16 px-12 max-w-7xl mx-auto w-full">
      {/* Left Content (60%) */}
      <div className="w-[60%] z-10 text-left flex flex-col items-start">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 text-primary font-bold text-sm mb-8"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          Nền tảng học tập 2026
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-7xl font-extrabold leading-[1.15] mb-12"
        >
          Nền tảng ôn thi <br />
          <span className="text-gradient drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            Triết học Mác - Lênin
          </span>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-row gap-5"
        >
          <Link to="/setup/02" className="btn-premium px-8 py-4 flex items-center justify-center gap-3 text-lg">
            <Play fill="currentColor" size={20} /> Bắt đầu ôn tập
          </Link>
          <Link to="/exams" className="glass-panel px-8 py-4 flex items-center justify-center gap-3 text-lg text-gray-200 hover:bg-white/10 hover:-translate-y-1 transition-all rounded-xl font-bold border-white/20">
            Khám phá thêm <ArrowRight size={20} />
          </Link>
        </motion.div>

        {/* Small Stats under buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-row items-center justify-start gap-6 mt-12"
        >
          <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-2xl border-white/10">
            <div className="p-2 bg-primary/20 rounded-xl"><Layers size={20} className="text-primary" /></div>
            <div className="text-left">
              <div className="font-bold text-white leading-tight">14</div>
              <div className="text-xs text-gray-400 font-medium">Bộ đề</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-2xl border-white/10">
            <div className="p-2 bg-cyan/20 rounded-xl"><BookOpen size={20} className="text-cyan" /></div>
            <div className="text-left">
              <div className="font-bold text-white leading-tight">840+</div>
              <div className="text-xs text-gray-400 font-medium">Câu hỏi</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-2xl border-white/10">
            <div className="p-2 bg-indigo/20 rounded-xl"><Clock size={20} className="text-indigo" /></div>
            <div className="text-left">
              <div className="font-bold text-white leading-tight">90p</div>
              <div className="text-xs text-gray-400 font-medium">Thi thử</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Visual Space (40%) - Naturally showing the background */}
      <div className="block w-[40%] h-[600px] relative pointer-events-none z-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-32 h-32 bg-cyan/20 rounded-full blur-[60px]" 
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" 
        />
        <motion.div
          animate={{ y: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-cyan shadow-[0_0_10px_#06B6D4]"
        />
        <motion.div
          animate={{ y: [15, -15, 15], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_#2563EB]"
        />
        <motion.div
          animate={{ x: [-10, 10, -10], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-indigo shadow-[0_0_10px_#6366F1]"
        />
      </div>
    </div>
  )
}
