import examMeta from '../data/examMeta.json'
import essayAnswers from '../data/essayAnswers.json'

const HISTORY_KEY = 'exam_history'

const safeRead = () => {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
}

export const getExamHistory = () => safeRead().sort((a, b) => new Date(b.finishedAt) - new Date(a.finishedAt))

export const getAttempt = (attemptId) => getExamHistory().find(attempt => attempt.id === attemptId)

export const saveExamResult = (attempt) => {
  const history = safeRead()
  const index = history.findIndex(item => item.id === attempt.id)
  if (index >= 0) history[index] = attempt
  else history.push(attempt)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  return attempt
}

export const normalizeText = value => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
export const normalizeSequenceAnswer = value => normalizeText(value).replace(/ /g, '')

export const extractKeywordsFromText = (text) => {
  if (!text) return [];
  if (text.includes('Khả năng – hiện thực')) {
      return ["khả năng", "hiện thực", "điều kiện thích hợp", "tác động thực tiễn"];
  }
  if (text.includes('Nội dung – hình thức')) {
      return ["nội dung", "hình thức", "quyết định", "độc lập tương đối", "tác động trở lại"];
  }
  if (text.includes('Bản chất – hiện tượng')) {
      return ["bản chất", "hiện tượng", "bên trong", "ổn định", "biểu hiện", "bên ngoài"];
  }
  if (text.includes('Quy luật phủ định của phủ định')) {
      return ["phủ định của phủ định", "phủ định biện chứng", "khách quan", "kế thừa", "phát triển"];
  }
  if (text.includes('cơ sở, động lực, mục đích, tiêu chuẩn kiểm nghiệm chân lý')) {
      return ["cơ sở", "động lực", "mục đích", "tiêu chuẩn kiểm nghiệm chân lý"];
  }
  if (text.includes('Quan điểm toàn diện; Quan điểm lịch sử')) {
      return ["quan điểm toàn diện", "quan điểm lịch sử", "thống nhất và đấu tranh", "mâu thuẫn", "nguyên nhân", "kết quả", "phủ định biện chứng"];
  }

  let parts = text.split(/[,;\.\-:\(\)\n]+/);
  let extracted = parts
      .map(p => p.trim().toLowerCase())
      .filter(p => p.length > 3)
      .filter(p => !['có thể xác định', 'bốn vai trò', 'hãy nêu', 'các nội dung', 'những nguyên lý'].includes(p));
      
  if (extracted.length === 0) {
      extracted = [text.trim()];
  }
  return extracted;
};

export const gradeEssayAnswer = (userAnswer, referenceAnswer, providedKeywords = []) => {
  const targetKeywords = (providedKeywords && providedKeywords.length > 0) 
      ? providedKeywords 
      : extractKeywordsFromText(referenceAnswer);
      
  const normalizedUserAnswer = normalizeText(userAnswer);
  
  const matchedKeywords = targetKeywords.filter(kw => normalizedUserAnswer.includes(normalizeText(kw)));
  const missingKeywords = targetKeywords.filter(kw => !normalizedUserAnswer.includes(normalizeText(kw)));
  
  const ratio = targetKeywords.length > 0 ? matchedKeywords.length / targetKeywords.length : 0;
  
  let status = 'wrong';
  let score = 0;
  
  if (ratio >= 1.0) {
      status = 'correct';
      score = 1;
  } else if (ratio >= 0.6) {
      status = 'partial';
      score = 1; 
  }
  
  return { status, score, matchedKeywords, missingKeywords, targetKeywords, ratio };
};

export const calculateAttempt = ({ id, exam, questions, answers, startTime, endTime }) => {
  let correct = 0
  let wrong = 0
  let unanswered = 0
  let textAnswered = 0
  let textUnanswered = 0
  let mcqTotal = 0
  let sequenceTotal = 0
  let textTotal = 0
  let essayScore = 0
  let sequenceScore = 0
  const referenceQuestions = essayAnswers.exams.find(item => item.examId === exam.id)?.questions ?? []
  const wrongQuestionNumbers = []
  const unansweredQuestionNumbers = []
  const answerDetails = questions.map(question => {
    const selected = answers[question.questionId] || ''
    const isMcq = !question.type || question.type === 'mcq'
    if (!isMcq) {
      const reference = referenceQuestions.find(item => item.questionId === question.questionId)
      const referenceAnswer = reference?.referenceAnswer || question.correct
      
      if (question.type === 'sequence') {
        sequenceTotal++
        let matches = normalizeSequenceAnswer(selected) === normalizeSequenceAnswer(referenceAnswer)
        if (!selected.trim()) { unanswered++; unansweredQuestionNumbers.push(question.questionId) }
        else if (matches) { correct++; sequenceScore += reference?.points ?? 1 }
        else { wrong++; wrongQuestionNumbers.push(question.questionId) }
        return { questionId: question.questionId, type: 'sequence', questionText: question.question, selected, userAnswer: selected, correct: referenceAnswer, correctAnswer: referenceAnswer, status: !selected.trim() ? 'unanswered' : matches ? 'correct' : 'wrong', result: !selected.trim() ? 'unanswered' : matches ? 'correct' : 'wrong', grading: { source: reference ? 'Word answer table' : 'Question answer mapping', score: matches ? (reference?.points ?? 1) : 0, points: reference?.points ?? 1 } }
      }
      
      // Text / Essay
      textTotal++
      
      if (!selected.trim()) { 
        textUnanswered++; 
        unanswered++; 
        unansweredQuestionNumbers.push(question.questionId);
        return { 
          questionId: question.questionId, 
          type: 'text', 
          questionText: question.question,
          selected, 
          userAnswer: selected, 
          correct: referenceAnswer, 
          correctAnswer: referenceAnswer, 
          status: 'unanswered', 
          result: 'unanswered', 
          achievedKeywords: [], 
          targetKeywords: reference?.keywords || [], 
          grading: { 
            source: reference ? 'Word answer table' : 'Question answer mapping', 
            score: 0, 
            points: reference?.points ?? 1 
          } 
        }
      }
      
      textAnswered++;
      const gradingResult = gradeEssayAnswer(selected, referenceAnswer, reference?.keywords);
      
      if (gradingResult.status === 'correct' || gradingResult.status === 'partial') {
          correct++;
          essayScore += reference?.points ?? 1; // Assuming full points for partial to not break grading
      } else {
          wrong++;
          wrongQuestionNumbers.push(question.questionId);
      }
      
      return { 
        questionId: question.questionId, 
        type: 'text', 
        questionText: question.question,
        selected, 
        userAnswer: selected, 
        correct: referenceAnswer, 
        correctAnswer: referenceAnswer, 
        status: gradingResult.status, 
        result: gradingResult.status, 
        achievedKeywords: gradingResult.matchedKeywords, 
        targetKeywords: gradingResult.targetKeywords, 
        grading: { 
          source: reference ? 'Word answer table' : 'Question answer mapping', 
          score: gradingResult.score * (reference?.points ?? 1), 
          points: reference?.points ?? 1 
        } 
      }
    }
    mcqTotal++
    const isCorrect = selected && selected.charAt(0).toUpperCase() === question.correct
    if (!selected) {
      unanswered++
      unansweredQuestionNumbers.push(question.questionId)
    }
    else if (isCorrect) correct++
    else {
      wrong++
      wrongQuestionNumbers.push(question.questionId)
    }
    return { questionId: question.questionId, type: 'mcq', questionText: question.question, selected, userAnswer: selected, correct: question.correct, correctAnswer: question.correct, status: !selected ? 'unanswered' : isCorrect ? 'correct' : 'wrong', result: !selected ? 'unanswered' : isCorrect ? 'correct' : 'wrong', options: question.answers }
  })
  const totalQuestions = questions.length
  const autoGradableTotal = mcqTotal + sequenceTotal + textTotal
  const percentage = autoGradableTotal ? Math.round((correct / autoGradableTotal) * 100) : 0
  const finishedAt = endTime || Date.now()
  return {
    id,
    examId: exam.id,
    examName: exam.title,
    startedAt: new Date(startTime).toISOString(),
    finishedAt: new Date(finishedAt).toISOString(),
    date: new Date(finishedAt).toISOString().slice(0, 10),
    duration: Math.max(0, Math.floor((finishedAt - startTime) / 1000)),
    totalQuestions,
    mcqTotal,
    sequenceTotal,
    textTotal,
    autoGradableTotal,
    textAnswered,
    textUnanswered,
    essayScore,
    sequenceScore,
    correct,
    correctCount: correct,
    wrong,
    wrongCount: wrong,
    unanswered,
    unansweredCount: unanswered,
    wrongQuestionNumbers: wrongQuestionNumbers.sort((a, b) => a - b),
    unansweredQuestionNumbers: unansweredQuestionNumbers.sort((a, b) => a - b),
    selectedAnswers: answerDetails.map(answer => ({ questionId: answer.questionId, selected: answer.selected })),
    correctAnswers: answerDetails.map(answer => ({ questionId: answer.questionId, correct: answer.correct })),
    score: Number((percentage / 10).toFixed(1)),
    percentage,
    answers: answerDetails
  }
}

export const calculateStatistics = (history, totalExams = examMeta.length) => {
  const completedExamIds = new Set(history.map(item => item.examId))
  const completedByExam = new Map()
  history.forEach(item => { if (!completedByExam.has(item.examId)) completedByExam.set(item.examId, item.totalQuestions) })
  const completedQuestions = [...completedByExam.values()].reduce((sum, count) => sum + count, 0)
  const totalQuestions = examMeta.reduce((sum, exam) => sum + (exam.questionCount || 60), 0)
  const correctQuestions = history.reduce((sum, item) => sum + item.correct, 0)
  const averageScore = history.length ? history.reduce((sum, item) => sum + item.score, 0) / history.length : 0
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const activeDays = new Set(history.map(item => item.date))
  let streak = 0
  for (let day = new Date(today); activeDays.has(day.toISOString().slice(0, 10)); day.setDate(day.getDate() - 1)) streak++
  return { completedExams: completedExamIds.size, totalExams, completedQuestions, totalQuestions, correctQuestions, averageScore, progress: totalQuestions ? Math.round((completedQuestions / totalQuestions) * 100) : 0, streak }
}

export const getWeeklyActivity = (history) => {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today); date.setDate(today.getDate() - 6 + index)
    const key = date.toISOString().slice(0, 10)
    return { label: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()], date: key, count: history.filter(item => item.date === key).length }
  })
}
