import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ExamList from './pages/ExamList'
import ExamSetup from './pages/ExamSetup'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import Review from './pages/Review'
import History from './pages/History'
import HistoryDetail from './pages/HistoryDetail'
import { useStore } from './store/useStore'

function ProtectedRoute({ children }) {
  const activeExam = useStore(s => s.activeExam)
  if (!activeExam) return <Navigate to="/exams" replace />
  return children
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:id" element={<HistoryDetail />} />
        <Route path="/exams" element={<ExamList />} />
        <Route path="/setup/:id" element={<ExamSetup />} />
        <Route path="/quiz" element={
          <ProtectedRoute><Quiz /></ProtectedRoute>
        } />
        <Route path="/result" element={
          <ProtectedRoute><Result /></ProtectedRoute>
        } />
        <Route path="/review" element={
          <ProtectedRoute><Review /></ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen w-full max-w-[1440px] mx-auto">
        <Navbar />
        <main className="flex-1 flex flex-col relative">
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  )
}
