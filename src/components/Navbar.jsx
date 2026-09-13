import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Home, LayoutDashboard, List, FileText, Search, Moon, History } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  
  if (location.pathname === '/quiz') return null
  
  const navLinks = [
    { name: 'Trang chủ', path: '/', icon: Home }, 
    { name: 'Đề thi', path: '/exams', icon: List },
    { name: 'Thống kê', path: '/dashboard', icon: LayoutDashboard }, 
    { name: 'Lịch sử', path: '/history', icon: History },
    { name: 'Tài liệu', path: '#', icon: FileText }
  ]
  
  return (
    <nav className="sticky top-0 z-50 glass-panel border-x-0 border-t-0 px-6 py-4 flex items-center justify-between min-w-[1200px]">
      <Link to="/" className="flex items-center gap-3 shrink-0">
        <div className="p-2 bg-gradient-to-br from-cyan to-primary rounded-xl shadow-lg">
          <BookOpen className="text-white w-6 h-6" />
        </div>
      </Link>
      
      <div className="flex items-center gap-6">
        {navLinks.map(link => { 
          const Icon = link.icon; 
          return (
            <Link key={link.name} to={link.path} className={`flex items-center gap-2 font-medium transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-gray-300 hover:text-white'}`}>
              <Icon size={18} />{link.name}
            </Link>
          ) 
        })}
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        <button className="p-2 text-gray-400 hover:text-white transition-colors"><Search size={20} /></button>
        <button className="p-2 text-gray-400 hover:text-white transition-colors"><Moon size={20} /></button>
        <Link to="/history" className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-bold transition-colors">
          <History size={18} /><span>Lịch sử</span>
        </Link>
      </div>
    </nav>
  )
}
