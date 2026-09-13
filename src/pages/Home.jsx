import { motion } from 'framer-motion'
import HeroSection from '../components/HeroSection'
import StatsCard from '../components/StatsCard'
import { BookOpen, Layers, Clock } from 'lucide-react'
import homeBg from '../assets/backgrounds/home-bg.png'

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-w-[1200px] flex-1 flex flex-col relative bg-[#030C1C]"
    >
      {/* Animated Background */}
      <motion.div
        initial={{ scale: 1.0 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${homeBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Dark Overlay Gradient */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-[#030C1C] via-[#030C1C]/60 to-transparent"
      />
      
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-[#030C1C] via-transparent to-transparent" />

      <HeroSection />

      {/* Statistics Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-12 py-12 mb-12">
        <div className="grid grid-cols-3 gap-6">
          <div className="flex-shrink-0"><StatsCard icon={Layers} value="14" label="Bộ đề luyện" delay={0.1} /></div>
          <div className="flex-shrink-0"><StatsCard icon={BookOpen} value="840+" label="Câu hỏi" delay={0.2} /></div>
          <div className="flex-shrink-0"><StatsCard icon={Clock} value="90 phút" label="Thi thử linh hoạt" delay={0.3} /></div>
        </div>
      </div>
    </motion.div>
  )
}
