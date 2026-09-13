import { useParams } from 'react-router-dom'
import { getAttempt } from '../services/historyService'
import ExamResultReview from '../components/ExamResultReview'

export default function HistoryDetail() {
  const { id } = useParams()
  const attempt = getAttempt(id)
  
  return <ExamResultReview attempt={attempt} backUrl="/history" backText="Quay lại lịch sử" />
}
