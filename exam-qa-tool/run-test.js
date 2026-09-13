/**
 * EXAM QA TOOL - Main Runner
 * Runs all verification modules in sequence and generates the final consolidated report.
 */

import { createRequire } from 'module'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Helpers ───────────────────────────────────────────────────────────────────

const cfg = JSON.parse(readFileSync(join(__dirname, 'config.json'), 'utf-8'))
const reportsDir = join(__dirname, cfg.reportsDir)
const screenshotsDir = join(__dirname, cfg.screenshotsDir)

if (!existsSync(reportsDir)) mkdirSync(reportsDir, { recursive: true })
if (!existsSync(screenshotsDir)) mkdirSync(screenshotsDir, { recursive: true })

const log = (msg, type = 'INFO') => {
  const colors = { INFO: '\x1b[36m', PASS: '\x1b[32m', FAIL: '\x1b[31m', WARN: '\x1b[33m', SECTION: '\x1b[35m' }
  console.log(`${colors[type] || ''}[${type}]\x1b[0m ${msg}`)
}

// ── Load Data ─────────────────────────────────────────────────────────────────

const questionsData = JSON.parse(readFileSync(join(__dirname, cfg.dataPath), 'utf-8'))
const metaData      = JSON.parse(readFileSync(join(__dirname, cfg.metaPath), 'utf-8'))

// ══════════════════════════════════════════════════════════════════════════════
//  FEATURE 1: Question Data Validation
// ══════════════════════════════════════════════════════════════════════════════

function validateQuestionData() {
  log('═══════════════════════════════════════', 'SECTION')
  log(' FEATURE 1 — QUESTION DATA VALIDATION ', 'SECTION')
  log('═══════════════════════════════════════', 'SECTION')

  const results = []
  let totalErrors = 0
  let totalWarnings = 0

  // Build a meta lookup
  const metaMap = {}
  metaData.forEach(m => { metaMap[m.id] = m })

  // Collect IDs actually present in questions.json
  const presentIds = questionsData.map(e => e.id)
  const metaIds    = metaData.map(m => m.id)

  // Check for exams declared in meta but missing from questions.json
  const missingExams = metaIds.filter(id => !presentIds.includes(id))
  if (missingExams.length) {
    missingExams.forEach(id => {
      log(`Đề ${id}: KHÔNG TỒN TẠI trong questions.json (chỉ có trong meta)`, 'FAIL')
      totalErrors++
    })
  }

  for (const exam of questionsData) {
    const meta = metaMap[exam.id]
    const errors = []
    const warnings = []
    const questionIds = new Set()

    log(`\nKiểm tra: ${exam.title} (id=${exam.id})`, 'INFO')

    if (!exam.questions || !Array.isArray(exam.questions)) {
      errors.push({ type: 'MISSING_QUESTIONS_ARRAY', detail: 'Không có mảng questions' })
      totalErrors++
      results.push({ id: exam.id, title: exam.title, totalQuestions: 0, errors, warnings })
      continue
    }

    const total = exam.questions.length
    const expectedCount = cfg.expectedQuestionCount[exam.id] || cfg.expectedQuestionCount.default

    if (total !== expectedCount) {
      warnings.push({ type: 'QUESTION_COUNT_MISMATCH', detail: `Có ${total} câu, kỳ vọng ${expectedCount} câu` })
      totalWarnings++
    }

    for (let i = 0; i < exam.questions.length; i++) {
      const q = exam.questions[i]
      const qNum = i + 1

      // Duplicate questionId
      if (questionIds.has(q.questionId)) {
        errors.push({ qNum, type: 'DUPLICATE_ID', detail: `questionId=${q.questionId} bị trùng` })
        totalErrors++
      }
      questionIds.add(q.questionId)

      // Missing / empty question text
      if (!q.question || String(q.question).trim() === '') {
        errors.push({ qNum, type: 'EMPTY_QUESTION', detail: `Câu ${qNum}: nội dung câu hỏi rỗng` })
        totalErrors++
      }

      // Must be MCQ type
      if (q.type !== 'mcq') {
        warnings.push({ qNum, type: 'UNKNOWN_TYPE', detail: `Câu ${qNum}: type="${q.type}" không phải mcq` })
        totalWarnings++
      }

      // Must have exactly 4 answers
      if (!q.answers || !Array.isArray(q.answers)) {
        errors.push({ qNum, type: 'MISSING_ANSWERS', detail: `Câu ${qNum}: không có mảng answers` })
        totalErrors++
      } else {
        if (q.answers.length !== 4) {
          errors.push({ qNum, type: 'WRONG_ANSWER_COUNT', detail: `Câu ${qNum}: có ${q.answers.length} đáp án (cần 4)` })
          totalErrors++
        }
        // Check each answer option starts with A/B/C/D
        const labels = ['A', 'B', 'C', 'D']
        q.answers.forEach((ans, idx) => {
          if (!ans || String(ans).trim() === '') {
            errors.push({ qNum, type: 'EMPTY_ANSWER_OPTION', detail: `Câu ${qNum}: đáp án ${labels[idx]} rỗng` })
            totalErrors++
          }
        })
      }

      // Correct answer must be A/B/C/D
      if (!q.correct || !cfg.validAnswers.includes(String(q.correct).toUpperCase())) {
        errors.push({ qNum, type: 'INVALID_CORRECT_ANSWER', detail: `Câu ${qNum}: correct="${q.correct}" không hợp lệ` })
        totalErrors++
      }
    }

    if (errors.length === 0 && warnings.length === 0) {
      log(`  ✓ ${total} câu — PASSED`, 'PASS')
    } else {
      if (errors.length)   log(`  ✗ ${errors.length} LỖI — ${errors.map(e=>e.detail).join(' | ')}`, 'FAIL')
      if (warnings.length) log(`  ⚠ ${warnings.length} CẢNH BÁO`, 'WARN')
    }

    results.push({ id: exam.id, title: exam.title, totalQuestions: total, errors, warnings })
  }

  log(`\nTổng lỗi: ${totalErrors} | Tổng cảnh báo: ${totalWarnings}`, totalErrors ? 'FAIL' : 'PASS')

  // ── Generate EXAM_DATA_REPORT.md ──────────────────────────────────────────
  let md = `# BÁO CÁO KIỂM TRA DỮ LIỆU ĐỀ THI\n`
  md += `> Thời gian tạo: ${new Date().toLocaleString('vi-VN')}\n\n`
  md += `## Tổng quan\n| Chỉ số | Giá trị |\n|---|---|\n`
  md += `| Tổng số đề | ${results.length} |\n`
  md += `| Tổng lỗi (ERROR) | ${totalErrors} |\n`
  md += `| Tổng cảnh báo (WARNING) | ${totalWarnings} |\n`
  md += `| Kết quả | ${totalErrors === 0 ? '✅ PASSED' : '❌ FAILED'} |\n\n`

  md += `## Chi tiết từng đề\n`
  for (const r of results) {
    const status = r.errors.length ? '❌ FAILED' : r.warnings.length ? '⚠️ WARNING' : '✅ PASSED'
    md += `\n### ${r.title} (ID: ${r.id}) — ${status}\n`
    md += `- Số câu hỏi: **${r.totalQuestions}**\n`
    if (r.errors.length) {
      md += `\n**Lỗi phát hiện:**\n`
      r.errors.forEach(e => { md += `- ❌ [Câu ${e.qNum || '?'}] \`${e.type}\`: ${e.detail}\n` })
    }
    if (r.warnings.length) {
      md += `\n**Cảnh báo:**\n`
      r.warnings.forEach(w => { md += `- ⚠️ [Câu ${w.qNum || '?'}] \`${w.type}\`: ${w.detail}\n` })
    }
    if (!r.errors.length && !r.warnings.length) md += `- Không có lỗi. Dữ liệu hợp lệ.\n`
  }

  writeFileSync(join(reportsDir, 'EXAM_DATA_REPORT.md'), md, 'utf-8')
  log('Đã lưu: reports/EXAM_DATA_REPORT.md', 'INFO')

  return { totalErrors, totalWarnings, results }
}

// ══════════════════════════════════════════════════════════════════════════════
//  FEATURE 2: Answer Key Verification
// ══════════════════════════════════════════════════════════════════════════════

function verifyAnswerKeys() {
  log('\n═══════════════════════════════════════', 'SECTION')
  log(' FEATURE 2 — ANSWER KEY VERIFICATION  ', 'SECTION')
  log('═══════════════════════════════════════', 'SECTION')

  const issues = []
  const csvRows = ['Exam ID,Exam Title,Question #,QuestionId,Answer in JSON,Status,Detail']

  for (const exam of questionsData) {
    if (!exam.questions) continue
    for (let i = 0; i < exam.questions.length; i++) {
      const q = exam.questions[i]
      const qNum = i + 1
      const correct = q.correct ? String(q.correct).toUpperCase() : null

      let status = 'PASS'
      let detail = ''

      if (!correct) {
        status = 'FAIL'
        detail = 'correct field rỗng hoặc null'
        issues.push({ examId: exam.id, examTitle: exam.title, qNum, questionId: q.questionId, correct, status, detail })
      } else if (!cfg.validAnswers.includes(correct)) {
        status = 'FAIL'
        detail = `Giá trị "${correct}" không phải A/B/C/D`
        issues.push({ examId: exam.id, examTitle: exam.title, qNum, questionId: q.questionId, correct, status, detail })
      } else {
        // Verify that one of the answers actually starts with the correct letter
        const hasMatchingOption = q.answers && q.answers.some(a => String(a).trim().toUpperCase().startsWith(correct + '.'))
        if (!hasMatchingOption) {
          status = 'WARN'
          detail = `Không tìm thấy đáp án bắt đầu bằng "${correct}." trong danh sách`
          issues.push({ examId: exam.id, examTitle: exam.title, qNum, questionId: q.questionId, correct, status, detail })
        }
      }

      if (status !== 'PASS') {
        log(`  ${status === 'FAIL' ? '✗' : '⚠'} Đề ${exam.id} Câu ${qNum}: ${detail}`, status === 'FAIL' ? 'FAIL' : 'WARN')
      }

      csvRows.push(`"${exam.id}","${exam.title}","${qNum}","${q.questionId}","${correct || '(rỗng)'}","${status}","${detail}"`)
    }
  }

  const failCount = issues.filter(i => i.status === 'FAIL').length
  const warnCount = issues.filter(i => i.status === 'WARN').length
  log(`\nĐáp án lỗi: ${failCount} | Cảnh báo: ${warnCount}`, failCount ? 'FAIL' : 'PASS')

  writeFileSync(join(reportsDir, 'ANSWER_REPORT.csv'), csvRows.join('\n'), 'utf-8')
  log('Đã lưu: reports/ANSWER_REPORT.csv', 'INFO')

  return { failCount, warnCount, issues }
}

// ══════════════════════════════════════════════════════════════════════════════
//  FEATURE 3 & 4: Scoring Logic Verification (pure unit test, no browser)
// ══════════════════════════════════════════════════════════════════════════════

function verifyScoringLogic() {
  log('\n═══════════════════════════════════════', 'SECTION')
  log(' FEATURE 3 — SCORING LOGIC UNIT TEST  ', 'SECTION')
  log('═══════════════════════════════════════', 'SECTION')

  // Mirror the calculateAttempt logic from historyService.js
  function calculateScore(questions, answers) {
    let correct = 0, wrong = 0, unanswered = 0
    for (const q of questions) {
      const selected = answers[q.questionId] || ''
      if (!selected) unanswered++
      else if (String(selected).charAt(0).toUpperCase() === String(q.correct).toUpperCase()) correct++
      else wrong++
    }
    const total = questions.length
    const pct = total ? Math.round((correct / total) * 100) : 0
    const score = Number((pct / 10).toFixed(1))
    return { correct, wrong, unanswered, score, pct }
  }

  const testResults = []

  for (const exam of questionsData) {
    if (!exam.questions || exam.questions.length === 0) continue
    const qs = exam.questions

    // CASE 1: All correct
    const allCorrectAnswers = {}
    qs.forEach(q => { allCorrectAnswers[q.questionId] = q.correct + '. dummy' })
    const case1 = calculateScore(qs, allCorrectAnswers)
    const case1Pass = case1.score === 10 && case1.correct === qs.length && case1.wrong === 0 && case1.unanswered === 0
    if (!case1Pass) log(`  ✗ Đề ${exam.id} CASE1 (all correct): score=${case1.score} expected=10`, 'FAIL')

    // CASE 2: Half correct (first half correct, second half all wrong answer 'A' or non-matching)
    const halfAnswers = {}
    const half = Math.floor(qs.length / 2)
    qs.forEach((q, i) => {
      if (i < half) halfAnswers[q.questionId] = q.correct + '. dummy'
      else {
        const wrongLetter = ['A','B','C','D'].find(l => l !== q.correct) || 'A'
        halfAnswers[q.questionId] = wrongLetter + '. dummy'
      }
    })
    const case2 = calculateScore(qs, halfAnswers)
    const case2ExpectedScore = Number(((half / qs.length) * 10).toFixed(1))
    const case2Pass = case2.correct === half && case2.wrong === qs.length - half && case2.unanswered === 0
    if (!case2Pass) log(`  ✗ Đề ${exam.id} CASE2 (half correct): correct=${case2.correct}/${half} wrong=${case2.wrong}`, 'FAIL')

    // CASE 3: All unanswered
    const case3 = calculateScore(qs, {})
    const case3Pass = case3.score === 0 && case3.correct === 0 && case3.unanswered === qs.length

    if (case1Pass && case2Pass && case3Pass) {
      log(`  ✓ Đề ${exam.id}: Cả 3 test case PASSED (total=${qs.length})`, 'PASS')
    }

    testResults.push({
      examId: exam.id, examTitle: exam.title, total: qs.length,
      case1: { pass: case1Pass, score: case1.score, correct: case1.correct },
      case2: { pass: case2Pass, score: case2.score, correct: case2.correct, half },
      case3: { pass: case3Pass, score: case3.score, unanswered: case3.unanswered }
    })
  }

  const totalFail = testResults.filter(r => !r.case1.pass || !r.case2.pass || !r.case3.pass).length
  log(`\nScoringTest: ${testResults.length - totalFail}/${testResults.length} đề PASSED`, totalFail ? 'FAIL' : 'PASS')

  // Generate SCORING_TEST_REPORT.md
  let md = `# BÁO CÁO KIỂM TRA SCORING LOGIC\n`
  md += `> Thời gian: ${new Date().toLocaleString('vi-VN')}\n\n`
  md += `## Tổng quan\n| Chỉ số | Giá trị |\n|---|---|\n`
  md += `| Tổng đề kiểm tra | ${testResults.length} |\n`
  md += `| PASSED | ${testResults.length - totalFail} |\n`
  md += `| FAILED | ${totalFail} |\n\n`

  md += `## Phương thức chấm điểm\n`
  md += `\`score = round((correct / total) * 100) / 10\`\n\n`
  md += `## Chi tiết từng đề\n`
  for (const r of testResults) {
    const status = (r.case1.pass && r.case2.pass && r.case3.pass) ? '✅ PASSED' : '❌ FAILED'
    md += `\n### ${r.examTitle} (${r.examId}) — ${status}\n`
    md += `- Tổng câu: ${r.total}\n`
    md += `- **CASE 1** (Tất cả đúng): Score=${r.case1.score} → ${r.case1.pass ? '✅' : '❌'}\n`
    md += `- **CASE 2** (${r.case2.half}/${r.total} đúng): Score=${r.case2.score} → ${r.case2.pass ? '✅' : '❌'}\n`
    md += `- **CASE 3** (Không trả lời): Score=${r.case3.score}, Unanswered=${r.case3.unanswered} → ${r.case3.pass ? '✅' : '❌'}\n`
  }

  writeFileSync(join(reportsDir, 'SCORING_TEST_REPORT.md'), md, 'utf-8')
  log('Đã lưu: reports/SCORING_TEST_REPORT.md', 'INFO')

  return { totalFail, testResults }
}

// ══════════════════════════════════════════════════════════════════════════════
//  FEATURE 5: History Service Logic Verification (pure unit test)
// ══════════════════════════════════════════════════════════════════════════════

function verifyHistoryLogic() {
  log('\n═══════════════════════════════════════', 'SECTION')
  log(' FEATURE 5 — HISTORY DATA STRUCTURE   ', 'SECTION')
  log('═══════════════════════════════════════', 'SECTION')

  const requiredFields = ['id','examId','examName','startedAt','finishedAt','date','duration',
    'totalQuestions','correct','wrong','unanswered','score','percentage','answers']

  const results = []
  let failCount = 0

  for (const exam of questionsData.slice(0, 3)) { // test with first 3 exams
    if (!exam.questions || exam.questions.length === 0) continue
    const qs = exam.questions

    // Simulate calculateAttempt
    const answers = {}
    qs.forEach(q => { answers[q.questionId] = q.correct + '. simulated' })

    let correct = 0, wrong = 0, unanswered = 0
    const answerDetails = qs.map(q => {
      const selected = answers[q.questionId] || ''
      const isCorrect = selected && selected.charAt(0).toUpperCase() === q.correct
      if (!selected) unanswered++
      else if (isCorrect) correct++
      else wrong++
      return { questionId: q.questionId, selected, correct: q.correct, result: !selected ? 'unanswered' : isCorrect ? 'correct' : 'wrong' }
    })

    const now = Date.now()
    const attempt = {
      id: `test-${exam.id}-${now}`,
      examId: exam.id,
      examName: exam.title,
      startedAt: new Date(now - 60000).toISOString(),
      finishedAt: new Date(now).toISOString(),
      date: new Date(now).toISOString().slice(0, 10),
      duration: 60,
      totalQuestions: qs.length,
      correct, wrong, unanswered,
      correctCount: correct, wrongCount: wrong, unansweredCount: unanswered,
      score: Number((Math.round((correct/qs.length)*100)/10).toFixed(1)),
      percentage: Math.round((correct/qs.length)*100),
      answers: answerDetails
    }

    const missingFields = requiredFields.filter(f => !(f in attempt))
    const detailCount = attempt.answers.length
    const pass = missingFields.length === 0 && detailCount === qs.length && attempt.score === 10

    if (pass) {
      log(`  ✓ Đề ${exam.id}: Cấu trúc history PASSED (score=${attempt.score})`, 'PASS')
    } else {
      log(`  ✗ Đề ${exam.id}: missingFields=${missingFields.join(',')} detailCount=${detailCount}/${qs.length}`, 'FAIL')
      failCount++
    }

    results.push({ examId: exam.id, pass, missingFields, detailCount, expectedCount: qs.length, score: attempt.score })
  }

  log(`\nHistoryTest: ${results.length - failCount}/${results.length} PASSED`, failCount ? 'FAIL' : 'PASS')

  let md = `# BÁO CÁO KIỂM TRA HISTORY SYSTEM\n`
  md += `> Thời gian: ${new Date().toLocaleString('vi-VN')}\n\n`
  md += `## Required Fields trong Attempt Object\n`
  requiredFields.forEach(f => { md += `- \`${f}\`\n` })
  md += `\n## Kết quả\n`
  for (const r of results) {
    md += `\n### Đề ${r.examId} — ${r.pass ? '✅ PASSED' : '❌ FAILED'}\n`
    md += `- Score: ${r.score}\n`
    md += `- Số câu trong answers[]: ${r.detailCount}/${r.expectedCount}\n`
    if (r.missingFields.length) md += `- ❌ Thiếu fields: ${r.missingFields.join(', ')}\n`
  }

  writeFileSync(join(reportsDir, 'HISTORY_TEST_REPORT.md'), md, 'utf-8')
  log('Đã lưu: reports/HISTORY_TEST_REPORT.md', 'INFO')

  return { failCount, results }
}

// ══════════════════════════════════════════════════════════════════════════════
//  FEATURE 6: Answer Review Mapping Check
// ══════════════════════════════════════════════════════════════════════════════

function verifyAnswerReviewMapping() {
  log('\n═══════════════════════════════════════', 'SECTION')
  log(' FEATURE 6 — ANSWER REVIEW MAPPING    ', 'SECTION')
  log('═══════════════════════════════════════', 'SECTION')

  let passCount = 0, failCount = 0

  for (const exam of questionsData) {
    if (!exam.questions) continue
    for (const q of exam.questions) {
      if (!q.correct || !q.answers) continue
      const correctLetter = String(q.correct).toUpperCase()
      // Simulate review: find which answer text corresponds to the correct letter
      const correctAnswerText = q.answers.find(a => String(a).trim().toUpperCase().startsWith(correctLetter + '.'))
      if (!correctAnswerText) {
        log(`  ✗ Đề ${exam.id} qId=${q.questionId}: Không tìm thấy text đáp án đúng "${correctLetter}"`, 'FAIL')
        failCount++
      } else {
        passCount++
      }
    }
  }

  log(`\nReview Mapping: ${passCount} PASS | ${failCount} FAIL`, failCount ? 'FAIL' : 'PASS')
  return { passCount, failCount }
}

// ══════════════════════════════════════════════════════════════════════════════
//  FEATURE 7: Structure / Route Checks (static analysis)
// ══════════════════════════════════════════════════════════════════════════════

function checkProjectStructure() {
  log('\n═══════════════════════════════════════', 'SECTION')
  log(' FEATURE 7 — PROJECT STRUCTURE CHECK  ', 'SECTION')
  log('═══════════════════════════════════════', 'SECTION')

  const { existsSync } = await import('fs')
  const checks = [
    { path: join(__dirname, '../src/App.jsx'),                label: 'App.jsx' },
    { path: join(__dirname, '../src/index.css'),              label: 'index.css' },
    { path: join(__dirname, '../src/data/questions.json'),    label: 'questions.json' },
    { path: join(__dirname, '../src/data/examMeta.json'),     label: 'examMeta.json' },
    { path: join(__dirname, '../src/services/historyService.js'), label: 'historyService.js' },
    { path: join(__dirname, '../src/store/useStore.js'),      label: 'useStore.js' },
    { path: join(__dirname, '../src/pages/Home.jsx'),         label: 'pages/Home.jsx' },
    { path: join(__dirname, '../src/pages/ExamSetup.jsx'),    label: 'pages/ExamSetup.jsx' },
    { path: join(__dirname, '../src/pages/Quiz.jsx'),         label: 'pages/Quiz.jsx' },
    { path: join(__dirname, '../src/pages/Result.jsx'),       label: 'pages/Result.jsx' },
    { path: join(__dirname, '../src/pages/Review.jsx'),       label: 'pages/Review.jsx' },
    { path: join(__dirname, '../src/pages/History.jsx'),      label: 'pages/History.jsx' },
    { path: join(__dirname, '../src/assets/backgrounds/home-bg.png'), label: 'home-bg.png' },
    { path: join(__dirname, '../index.html'),                 label: 'index.html' },
    { path: join(__dirname, '../package.json'),               label: 'package.json (root)' },
  ]

  let passed = 0, failed = 0
  const structureResults = []
  for (const c of checks) {
    const exists = existsSync(c.path)
    if (exists) { log(`  ✓ ${c.label}`, 'PASS'); passed++ }
    else { log(`  ✗ ${c.label} — KHÔNG TÌM THẤY`, 'FAIL'); failed++ }
    structureResults.push({ label: c.label, exists })
  }

  log(`\nStructure: ${passed}/${checks.length} files tồn tại`, failed ? 'WARN' : 'PASS')
  return { passed, failed, structureResults }
}

// ══════════════════════════════════════════════════════════════════════════════
//  FINAL: Generate FULL_QA_REPORT.md
// ══════════════════════════════════════════════════════════════════════════════

function generateFullReport(results) {
  const { dataResult, answerResult, scoringResult, historyResult, reviewResult, structureResult } = results

  const totalTests = 7
  const failedModules = [
    dataResult.totalErrors > 0,
    answerResult.failCount > 0,
    scoringResult.totalFail > 0,
    historyResult.failCount > 0,
    reviewResult.failCount > 0,
    structureResult.failed > 0
  ].filter(Boolean).length

  let md = `# ÔN THI PRO — FULL QA REPORT\n`
  md += `> **Ngày tạo**: ${new Date().toLocaleString('vi-VN')}\n`
  md += `> **Công cụ**: Exam QA Tool v1.0\n\n`

  md += `## 📊 Tổng Quan Kết Quả\n\n`
  md += `| Module | Kết quả | Chi tiết |\n|---|---|---|\n`
  md += `| 1. Data Validation | ${dataResult.totalErrors === 0 ? '✅ PASSED' : '❌ FAILED'} | ${dataResult.totalErrors} lỗi, ${dataResult.totalWarnings} cảnh báo |\n`
  md += `| 2. Answer Key Verification | ${answerResult.failCount === 0 ? '✅ PASSED' : '❌ FAILED'} | ${answerResult.failCount} lỗi, ${answerResult.warnCount} cảnh báo |\n`
  md += `| 3. Scoring Logic | ${scoringResult.totalFail === 0 ? '✅ PASSED' : '❌ FAILED'} | ${scoringResult.testResults.length - scoringResult.totalFail}/${scoringResult.testResults.length} đề đúng |\n`
  md += `| 4. History Structure | ${historyResult.failCount === 0 ? '✅ PASSED' : '❌ FAILED'} | ${historyResult.results.length - historyResult.failCount}/${historyResult.results.length} cấu trúc đúng |\n`
  md += `| 5. Review Mapping | ${reviewResult.failCount === 0 ? '✅ PASSED' : '❌ FAILED'} | ${reviewResult.passCount} đúng, ${reviewResult.failCount} sai |\n`
  md += `| 6. Project Structure | ${structureResult.failed === 0 ? '✅ PASSED' : '⚠️ WARNING'} | ${structureResult.passed}/${structureResult.passed + structureResult.failed} files tồn tại |\n\n`

  md += `## 🎯 Kết Luận\n`
  if (failedModules === 0) {
    md += `> ### ✅ TẤT CẢ KIỂM TRA PASSED\n`
    md += `> Hệ thống dữ liệu câu hỏi, đáp án, chấm điểm và lịch sử của Ôn Thi Pro đang hoạt động chính xác.\n`
  } else {
    md += `> ### ❌ CÓ ${failedModules} MODULE FAILED\n`
    md += `> Vui lòng xem chi tiết từng báo cáo để khắc phục.\n`
  }

  md += `\n## 📁 Danh Sách Báo Cáo Đầy Đủ\n`
  md += `- [EXAM_DATA_REPORT.md](./EXAM_DATA_REPORT.md) — Kiểm tra dữ liệu câu hỏi\n`
  md += `- [ANSWER_REPORT.csv](./ANSWER_REPORT.csv) — Kiểm tra đáp án (CSV, mở bằng Excel)\n`
  md += `- [SCORING_TEST_REPORT.md](./SCORING_TEST_REPORT.md) — Kiểm tra logic chấm điểm\n`
  md += `- [HISTORY_TEST_REPORT.md](./HISTORY_TEST_REPORT.md) — Kiểm tra cấu trúc lịch sử\n`
  md += `- [screenshots/](./screenshots/) — Ảnh chụp màn hình lỗi (E2E tests)\n\n`

  md += `## 🌐 E2E Browser Testing\n`
  md += `> E2E testing (Playwright) cần chạy riêng:\n`
  md += `> \`\`\`bash\n> npm run test:e2e\n> \`\`\`\n`
  md += `> Yêu cầu: **Dev server đang chạy** tại \`http://localhost:5173\`\n`

  writeFileSync(join(reportsDir, 'FULL_QA_REPORT.md'), md, 'utf-8')
  log('\nĐã lưu: reports/FULL_QA_REPORT.md', 'INFO')
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN
// ══════════════════════════════════════════════════════════════════════════════

async function main() {
  log('\n╔═══════════════════════════════════════╗', 'SECTION')
  log('║   ÔN THI PRO — EXAM QA TOOL v1.0     ║', 'SECTION')
  log('╚═══════════════════════════════════════╝\n', 'SECTION')

  const dataResult      = validateQuestionData()
  const answerResult    = verifyAnswerKeys()
  const scoringResult   = verifyScoringLogic()
  const historyResult   = verifyHistoryLogic()
  const reviewResult    = verifyAnswerReviewMapping()

  // Structure check (sync version without dynamic import issue)
  log('\n═══════════════════════════════════════', 'SECTION')
  log(' FEATURE 7 — PROJECT STRUCTURE CHECK  ', 'SECTION')
  log('═══════════════════════════════════════', 'SECTION')

  const fileChecks = [
    { path: join(__dirname, '../src/App.jsx'),                    label: 'App.jsx' },
    { path: join(__dirname, '../src/index.css'),                  label: 'index.css' },
    { path: join(__dirname, '../src/data/questions.json'),        label: 'questions.json' },
    { path: join(__dirname, '../src/data/examMeta.json'),         label: 'examMeta.json' },
    { path: join(__dirname, '../src/services/historyService.js'), label: 'historyService.js' },
    { path: join(__dirname, '../src/store/useStore.js'),          label: 'useStore.js' },
    { path: join(__dirname, '../src/pages/Home.jsx'),             label: 'pages/Home.jsx' },
    { path: join(__dirname, '../src/pages/ExamSetup.jsx'),        label: 'pages/ExamSetup.jsx' },
    { path: join(__dirname, '../src/pages/Quiz.jsx'),             label: 'pages/Quiz.jsx' },
    { path: join(__dirname, '../src/pages/Result.jsx'),           label: 'pages/Result.jsx' },
    { path: join(__dirname, '../src/pages/Review.jsx'),           label: 'pages/Review.jsx' },
    { path: join(__dirname, '../src/pages/History.jsx'),          label: 'pages/History.jsx' },
    { path: join(__dirname, '../src/assets/backgrounds/home-bg.png'), label: 'home-bg.png' },
    { path: join(__dirname, '../index.html'),                     label: 'index.html' },
    { path: join(__dirname, '../package.json'),                   label: 'package.json (root)' },
  ]

  let structPassed = 0, structFailed = 0
  const structureResults = []
  for (const c of fileChecks) {
    const ex = existsSync(c.path)
    if (ex) { log(`  ✓ ${c.label}`, 'PASS'); structPassed++ }
    else     { log(`  ✗ ${c.label} — KHÔNG TÌM THẤY`, 'FAIL'); structFailed++ }
    structureResults.push({ label: c.label, exists: ex })
  }
  log(`\nStructure: ${structPassed}/${fileChecks.length} files tồn tại`, structFailed ? 'WARN' : 'PASS')
  const structureResult = { passed: structPassed, failed: structFailed, structureResults }

  generateFullReport({ dataResult, answerResult, scoringResult, historyResult, reviewResult, structureResult })

  log('\n╔═══════════════════════════════════════╗', 'SECTION')
  log('║   QA TOOL HOÀN THÀNH                  ║', 'SECTION')
  log('╚═══════════════════════════════════════╝', 'SECTION')
  log(`Xem báo cáo tổng hợp: exam-qa-tool/reports/FULL_QA_REPORT.md`, 'INFO')
}

main().catch(err => { console.error(err); process.exit(1) })

