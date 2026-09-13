import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(persist((set) => ({
  activeExam: null,
  mode: 'practice', // practice or exam
  timeLimit: 90,
  shuffleQuestions: false,
  shuffleAnswers: false,
  
  questions: [],
  answers: {},
  
  startTime: null,
  endTime: null,
  attemptId: null,
  currentQuestionIndex: 0,
  
  setupExam: (config) => set({
    ...config,
    answers: {},
    startTime: Date.now(),
    endTime: null,
    currentQuestionIndex: 0,
    attemptId: crypto.randomUUID()
  }),
  
  setAnswer: (qId, ans) => set((state) => ({
    answers: { ...state.answers, [qId]: ans }
  })),
  setCurrentQuestionIndex: (currentQuestionIndex) => set({ currentQuestionIndex }),

  submitExam: () => set({ endTime: Date.now() }),

  reset: () => set({ activeExam: null, questions: [], answers: {}, startTime: null, endTime: null, attemptId: null, currentQuestionIndex: 0 })
}), {
  name: 'exam_session',
  partialize: (state) => ({
    activeExam: state.activeExam,
    mode: state.mode,
    timeLimit: state.timeLimit,
    shuffleQuestions: state.shuffleQuestions,
    shuffleAnswers: state.shuffleAnswers,
    questions: state.questions,
    answers: state.answers,
    startTime: state.startTime,
    endTime: state.endTime,
    attemptId: state.attemptId,
    currentQuestionIndex: state.currentQuestionIndex
  })
}))
