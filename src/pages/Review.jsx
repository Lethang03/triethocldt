import { useSearchParams } from 'react-router-dom'
import { getAttempt } from '../services/historyService'
import ExamResultReview from '../components/ExamResultReview'

export default function Review() {
  const [params] = useSearchParams()
  const attemptId = params.get('attempt')
  const attempt = getAttempt(attemptId)
  
  return <ExamResultReview attempt={attempt} backUrl="/result" backText="Quay lại kết quả" />
}
