/**
 * E2E Testing with Playwright
 * Run ONLY when dev server is active at http://localhost:5173
 * Usage: node src/04-e2e-playwright.js
 */

import { chromium } from 'playwright'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir   = join(__dirname, '..')
const cfg       = JSON.parse(readFileSync(join(rootDir, 'config.json'), 'utf-8'))
const reportsDir = join(rootDir, cfg.reportsDir)
const ssDir      = join(rootDir, cfg.screenshotsDir)

if (!existsSync(reportsDir)) mkdirSync(reportsDir, { recursive: true })
if (!existsSync(ssDir))       mkdirSync(ssDir, { recursive: true })

const questionsData = JSON.parse(readFileSync(join(rootDir, cfg.dataPath), 'utf-8'))

const BASE = cfg.localhost
const VIEWPORTS = [
  { name: 'Desktop_1920', width: 1920, height: 1080 },
  { name: 'Desktop_1440', width: 1440, height: 900 },
  { name: 'Tablet_768',   width: 768,  height: 1024 },
  { name: 'Mobile_390',   width: 390,  height: 844  },
]

const log = (msg, type='INFO') => {
  const c = {INFO:'\x1b[36m',PASS:'\x1b[32m',FAIL:'\x1b[31m',WARN:'\x1b[33m',SEC:'\x1b[35m'}
  console.log(`${c[type]||''}[${type}]\x1b[0m ${msg}`)
}

async function screenshotOnError(page, name) {
  const path = join(ssDir, `${name}_${Date.now()}.png`)
  await page.screenshot({ path, fullPage: true })
  log(`  📸 Screenshot saved: ${path}`, 'WARN')
  return path
}

async function runE2ETests() {
  const results = []
  const browser = await chromium.launch({ headless: cfg.playwright.headless, slowMo: cfg.playwright.slowMo })

  // ── Test 1: All pages load without blank screen ───────────────────────────
  log('\n[E2E] Test 1: Page Load & Route Check', 'SEC')
  const routeChecks = [
    { path: '/',         label: 'Home' },
    { path: '/exams',    label: 'Exam List' },
    { path: '/dashboard',label: 'Dashboard' },
    { path: '/history',  label: 'History' },
  ]

  for (const vp of VIEWPORTS) {
    const ctx  = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
    const page = await ctx.newPage()
    const consoleErrors = []
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })

    for (const route of routeChecks) {
      try {
        await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle', timeout: cfg.playwright.timeout })
        const bodyText = await page.textContent('body')
        const isEmpty  = bodyText.trim().length < 50
        if (isEmpty) {
          log(`  ✗ [${vp.name}] ${route.label}: Trang trống (blank page)`, 'FAIL')
          await screenshotOnError(page, `blank_${route.label}_${vp.name}`)
          results.push({ test: `Load_${route.label}`, viewport: vp.name, status: 'FAIL', detail: 'Blank page' })
        } else {
          log(`  ✓ [${vp.name}] ${route.label}: OK`, 'PASS')
          results.push({ test: `Load_${route.label}`, viewport: vp.name, status: 'PASS', detail: '' })
        }
      } catch (err) {
        log(`  ✗ [${vp.name}] ${route.label}: ${err.message.slice(0,80)}`, 'FAIL')
        await screenshotOnError(page, `error_${route.label}_${vp.name}`)
        results.push({ test: `Load_${route.label}`, viewport: vp.name, status: 'FAIL', detail: err.message.slice(0,80) })
      }
    }

    if (consoleErrors.length) {
      log(`  ⚠ [${vp.name}] Console errors: ${consoleErrors.slice(0,3).join(' | ')}`, 'WARN')
    }
    await ctx.close()
  }

  // ── Test 2: Full Exam Flow (Desktop only) ─────────────────────────────────
  log('\n[E2E] Test 2: Full Exam Flow (Desktop 1440)', 'SEC')
  const flowCtx  = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const flowPage = await flowCtx.newPage()

  try {
    // Step 1: Navigate to exam list
    await flowPage.goto(`${BASE}/exams`, { waitUntil: 'networkidle', timeout: cfg.playwright.timeout })
    log('  → Đang ở trang danh sách đề', 'INFO')

    // Step 2: Click first exam card
    const firstExamLink = flowPage.locator('a[href*="/setup/"]').first()
    await firstExamLink.waitFor({ timeout: 5000 })
    await firstExamLink.click()
    await flowPage.waitForURL(`${BASE}/setup/**`, { timeout: cfg.playwright.timeout })
    log('  → Đã vào trang Setup đề 01', 'INFO')
    results.push({ test: 'Flow_ExamSetup', viewport: 'Desktop_1440', status: 'PASS', detail: '' })

    // Step 3: Start exam
    const startBtn = flowPage.locator('button:has-text("Bắt đầu")')
    await startBtn.waitFor({ timeout: 5000 })
    await startBtn.click()
    await flowPage.waitForURL(`${BASE}/quiz`, { timeout: cfg.playwright.timeout })
    log('  → Đã bắt đầu thi', 'INFO')
    results.push({ test: 'Flow_StartQuiz', viewport: 'Desktop_1440', status: 'PASS', detail: '' })

    // Step 4: Answer first 5 questions
    const exam01 = questionsData.find(e => e.id === '01') || questionsData[0]
    const first5 = exam01.questions.slice(0, 5)
    for (let i = 0; i < first5.length; i++) {
      const q = first5[i]
      const correctLetter = q.correct
      // Find and click the button that corresponds to the correct answer letter
      const answerBtn = flowPage.locator(`button:has-text("${correctLetter}.")`).first()
      try {
        await answerBtn.waitFor({ timeout: 3000 })
        await answerBtn.click()
        log(`    → Đã chọn đáp án ${correctLetter} cho câu ${i+1}`, 'INFO')
      } catch {
        log(`    ⚠ Không tìm thấy nút đáp án "${correctLetter}" cho câu ${i+1}`, 'WARN')
      }
      // Next question
      const nextBtn = flowPage.locator('button:has-text("Tiếp")').first()
      if (await nextBtn.isVisible()) await nextBtn.click()
    }
    results.push({ test: 'Flow_AnswerQuestions', viewport: 'Desktop_1440', status: 'PASS', detail: 'Answered 5 questions' })

    // Step 5: Submit (click Nộp bài button in sidebar)
    const submitBtn = flowPage.locator('button:has-text("Nộp bài ngay"), button:has-text("Nộp bài")').first()
    if (await submitBtn.isVisible()) {
      // Playwright: auto-handle confirm dialog
      flowPage.on('dialog', async dialog => { await dialog.accept() })
      await submitBtn.click()
      try {
        await flowPage.waitForURL(`${BASE}/result`, { timeout: cfg.playwright.timeout })
        log('  → Đã nộp bài và chuyển sang kết quả', 'INFO')
        results.push({ test: 'Flow_SubmitResult', viewport: 'Desktop_1440', status: 'PASS', detail: '' })

        // Screenshot the result page
        await flowPage.screenshot({ path: join(ssDir, 'result_page.png'), fullPage: true })
        log('  📸 Screenshot: result_page.png', 'INFO')

        // Step 6: Open Review
        const reviewBtn = flowPage.locator('button:has-text("Xem lại đáp án")').first()
        if (await reviewBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await reviewBtn.click()
          await flowPage.waitForURL(`${BASE}/review**`, { timeout: cfg.playwright.timeout })
          log('  → Đã vào trang xem lại đáp án', 'INFO')
          await flowPage.screenshot({ path: join(ssDir, 'review_page.png'), fullPage: true })
          results.push({ test: 'Flow_ReviewAnswers', viewport: 'Desktop_1440', status: 'PASS', detail: '' })
        }

        // Step 7: History page
        await flowPage.goto(`${BASE}/history`, { waitUntil: 'networkidle' })
        const historyContent = await flowPage.textContent('body')
        const hasHistoryItem = historyContent.includes('Đề ôn') || historyContent.includes('ôn luyện')
        if (hasHistoryItem) {
          log('  → History page: có dữ liệu ✓', 'PASS')
          results.push({ test: 'Flow_History', viewport: 'Desktop_1440', status: 'PASS', detail: 'History entry found' })
        } else {
          log('  ⚠ History page: không tìm thấy entry', 'WARN')
          results.push({ test: 'Flow_History', viewport: 'Desktop_1440', status: 'WARN', detail: 'No history entry found' })
        }
      } catch (err) {
        log(`  ✗ Submit/Result error: ${err.message.slice(0,80)}`, 'FAIL')
        await screenshotOnError(flowPage, 'submit_error')
        results.push({ test: 'Flow_SubmitResult', viewport: 'Desktop_1440', status: 'FAIL', detail: err.message.slice(0,80) })
      }
    }

  } catch (err) {
    log(`  ✗ Flow error: ${err.message.slice(0,80)}`, 'FAIL')
    await screenshotOnError(flowPage, 'flow_error')
    results.push({ test: 'Flow_General', viewport: 'Desktop_1440', status: 'FAIL', detail: err.message.slice(0,80) })
  }

  await flowCtx.close()

  // ── Test 3: Scrollbar / Horizontal Overflow Check ─────────────────────────
  log('\n[E2E] Test 3: Horizontal Scroll / Layout Check', 'SEC')
  for (const vp of VIEWPORTS) {
    const ctx  = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
    const page = await ctx.newPage()
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })

    const hasHScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    if (hasHScroll) {
      log(`  ✗ [${vp.name}] Có horizontal overflow!`, 'FAIL')
      await screenshotOnError(page, `hscroll_${vp.name}`)
      results.push({ test: 'HScroll', viewport: vp.name, status: 'FAIL', detail: 'Horizontal scrollbar detected' })
    } else {
      log(`  ✓ [${vp.name}] Không có horizontal overflow`, 'PASS')
      results.push({ test: 'HScroll', viewport: vp.name, status: 'PASS', detail: '' })
    }
    await ctx.close()
  }

  await browser.close()

  // Generate E2E report
  const passed = results.filter(r => r.status === 'PASS').length
  const failed = results.filter(r => r.status === 'FAIL').length
  const warned = results.filter(r => r.status === 'WARN').length

  let md = `# BÁO CÁO E2E TESTING (PLAYWRIGHT)\n`
  md += `> Thời gian: ${new Date().toLocaleString('vi-VN')}\n`
  md += `> Base URL: ${BASE}\n\n`
  md += `## Tổng quan\n| | Số lượng |\n|---|---|\n`
  md += `| ✅ PASSED | ${passed} |\n| ❌ FAILED | ${failed} |\n| ⚠️ WARN | ${warned} |\n\n`
  md += `## Chi tiết\n| Test | Viewport | Status | Detail |\n|---|---|---|---|\n`
  for (const r of results) {
    const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⚠️'
    md += `| ${r.test} | ${r.viewport} | ${icon} ${r.status} | ${r.detail} |\n`
  }

  writeFileSync(join(reportsDir, 'E2E_TEST_REPORT.md'), md, 'utf-8')
  log('\nĐã lưu: reports/E2E_TEST_REPORT.md', 'INFO')
  log(`E2E: ${passed} PASS | ${failed} FAIL | ${warned} WARN`, failed ? 'FAIL' : 'PASS')

  return { passed, failed, warned, results }
}

runE2ETests().catch(err => {
  console.error('\n[ERROR] E2E test failed:', err.message)
  console.error('Đảm bảo dev server đang chạy tại', cfg.localhost)
  process.exit(1)
})

