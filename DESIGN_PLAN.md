# DESIGN PLAN: Ôn Thi Pro (Premium 2026 Edition)

## 1. Full UI Architecture
- **Home Landing Page (`/`)**: 
  - **Navbar**: Logo, Navigation Links, Theme Toggle, Search, Login CTA.
  - **Hero Section**: 
    - Left: Title "Nền tảng ôn thi Triết học Mác - Lênin", Subtitle, CTAs. 
    - Right: Premium illustration with Karl Marx statue, books, blue cinematic lighting, glass overlay, soft glow, floating particles.
  - **Statistics**: 14 Bộ đề, 840+ Câu hỏi, 90 phút thi thử, AI Phân tích.
- **User Dashboard (`/dashboard`)**:
  - Welcome banner "Xin chào, Hào 👋".
  - Overview Cards: 5 Đề đã làm, 8.6 Điểm trung bình, 75% Tiến độ, chuỗi 5 ngày.
  - Layout: Weekly activity chart, Recent exams list, Wrong answers section, Favorite questions.
- **Exam List (`/exams`)**: 
  - Grid of premium Exam Cards. Shows status (Chưa làm, Đang thực hiện, Hoàn thành) with hover lift and blue glow.
- **Exam Setup (`/setup/:id`)**: 
  - Modern glass card modal/page to pick mode, time, and shuffle options.
- **Quiz Interface (`/quiz`)**: 
  - Desktop: 75% Left (Question), 25% Right (Navigator). Header with timer and pause.
  - Mobile: Full width question, bottom sheet navigator, bottom navigation.
- **Result Dashboard (`/result`)**: 
  - Circular score. Progress chart. Performance analysis. Action buttons.
- **Answer Review (`/review`)**: 
  - Question, User answer vs Correct answer, Explanation panel, References.

## 2. Component Hierarchy
```
src/
 ├── components/
 │    ├── Navbar.jsx           # Top/Bottom navigation
 │    ├── HeroSection.jsx      # Cinematic hero layout
 │    ├── StatsCard.jsx        # Landing stats
 │    ├── ExamCard.jsx         # Card for list/dashboard
 │    ├── QuestionCard.jsx     # Active question UI
 │    ├── QuestionNavigator.jsx# Number grid
 │    ├── ProgressBar.jsx      # Test progress
 │    ├── ResultChart.jsx      # Score/Progress visualizer
 │    └── ReviewCard.jsx       # Answer review breakdown
 ├── pages/
 │    ├── Home.jsx             # Landing Page
 │    ├── Dashboard.jsx        # User Analytics
 │    ├── ExamList.jsx         # All exams
 │    ├── ExamSetup.jsx        # Config screen
 │    ├── Quiz.jsx             # Test taking
 │    ├── Result.jsx           # Post-test stats
 │    └── Review.jsx           # Deep dive review
```

## 3. Color System (Dark Premium Education UI)
- **Background**: `#071426` (Deep space blue)
- **Secondary Background**: `#0B1930`
- **Card**: `#10243D`
- **Primary Blue**: `#2563EB`
- **Gradient**: `#06B6D4` → `#2563EB` → `#6366F1`
- **Success**: `#22C55E`
- **Danger**: `#EF4444`
- **Warning**: `#F59E0B`
- **Typography**: Inter (Body), Be Vietnam Pro (Headings)

## 4. Animation Strategy
- **Library**: `framer-motion`
- **Transitions**: Page fade-in/out (`opacity`, `y` translation).
- **Interactions**: Card hover lift (`scale: 1.02`, `y: -5`), glowing borders (`box-shadow`), pulsing states.
- **Performance**: Strict CSS transforms, minimal repaints. Use GPU acceleration.
- **Mobile**: Spring-based bottom sheet reveal.

## 5. Data Migration Plan
- **Source**: `E:\bo_de_02_15_4_bo_70_cau.html`
- **Engine**: `extract.js` running on `npm preinstall`.
- **Target**: `src/data/questions.json`
- **Integrity**: Retain original questions, passage text, options, and correct answer model. Maps dynamically into Zustand state.
