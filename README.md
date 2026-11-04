# 📝 Quiz Builder — Interactive Assessment Platform

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel&logoColor=white)](https://quiz-builder-sooty.vercel.app)

> A modern, responsive web application for creating, managing, and taking interactive quizzes. Designed with role-based workflows for **Admins** (Quiz Creators) and **Users** (Participants), featuring live countdown timers, randomization, score tracking, analytics, and instant answer evaluations.

---

## 🔗 Live Links

- **🌐 Live Vercel Deployment:** [https://quiz-builder-sooty.vercel.app](https://quiz-builder-sooty.vercel.app)
- **🐙 GitHub Repository:** [https://github.com/2500031148/quiz-builder](https://github.com/2500031148/quiz-builder)

---

## 🎯 Evaluation Checklist (Project Review 2)

| Criteria | Status | Implementation Details |
| :--- | :---: | :--- |
| **1. React + Vite Project** | ✅ Completed | Built using React 18, Vite 6, and modern modular structure |
| **2. Module Identification** | ✅ Completed | Distinct **Admin** and **User** modules with protected routing |
| **3. Login & Signup** | ✅ Completed | Client-side authentication with `localStorage` persistence |
| **4. Vercel Deployment** | ✅ Completed | Live at `quiz-builder-sooty.vercel.app` with SPA routing rules |

---

## 🔑 Demo Credentials

Quick demo accounts are pre-seeded on first launch. You can also use the **Quick Demo buttons** on the login page:

| Role | Email | Password | Access / Capabilities |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@quiz.com` | `admin123` | Create, edit, delete quizzes; view reports & participant analytics |
| **👤 User** | `user@quiz.com` | `user123` | Browse quizzes, attempt timed quizzes, review performance history |

*(New accounts can also be created freely via the **Signup** page with either role).*

---

## ✨ Features & Modules

### 1. 🔐 Authentication & Role Management
- **Local Storage Persistence:** User data and active sessions are stored securely in the browser's `localStorage`.
- **Role-Based Protected Routes:** Route guards (`ProtectedRoute.jsx`) restrict `/admin/*` routes to administrators and `/user/*` routes to learners.
- **Auto-Seeding:** Automatically seeds demo users and default sample quizzes on initial load.

### 2. 👑 Admin Module (`/admin`)
- **Admin Dashboard:** High-level metrics tracking total quizzes created, participant count, total attempts, and platform-wide average scores.
- **Quiz Creator:**
  - Support for multiple question formats:
    - **Multiple Choice Questions (MCQ)** with radio selection for correct answer
    - **True / False** questions
    - **Open-Ended** text questions
  - Configurable per-quiz time limits (minutes).
  - Configurable question shuffling / randomization toggle.
  - Category tagging (Science, Tech, Math, General, etc.).
- **Manage Quizzes:** Tabular overview of all quizzes with quick edit, delete, and attempt metrics.
- **Reports & Analytics:**
  - Detailed per-quiz pass rates and average scores.
  - Comprehensive attempts log showing participant names, scores, completion times, and timestamps.

### 3. 👤 User Module (`/user`)
- **User Dashboard:** Card grid of available quizzes showcasing categories, question count, time limit, and user's previous attempt score badge.
- **Interactive Quiz Player:**
  - Real-time countdown timer with visual urgency alerts.
  - Automatic submission when the timer runs out.
  - Question pagination with direct jump buttons.
  - Dynamic progress indicator.
  - Shuffled question order when randomization is enabled.
- **Results & Performance Evaluation:**
  - Visual circular score percentage card.
  - Performance feedback badges (Excellent / Good / Needs Practice).
  - In-depth question-by-question review highlighting correct answers versus user selections.
- **Attempt History:** Log of past attempts with status (Pass/Fail), timestamps, and links to re-review scores.

---

## 🛠️ Technology Stack

- **Frontend Framework:** [React 18](https://react.dev/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **State Management & Persistence:** React Context API (`AuthContext`, `QuizContext`) + Web `localStorage` API
- **Styling:** Modern Vanilla CSS using CSS Variables, Flexbox, and CSS Grid
- **Deployment & Hosting:** [Vercel](https://vercel.com/) with single-page application (SPA) rewrite rules

---

## 📁 Project Directory Structure

```text
quiz-builder/
├── public/
│   └── quiz-icon.svg             # Application favicon / icon
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Role-aware navigation header
│   │   ├── Navbar.css            # Navigation styling
│   │   └── ProtectedRoute.jsx     # Route authentication guard
│   ├── context/
│   │   ├── AuthContext.jsx       # Auth state, login/signup/logout, demo seeding
│   │   └── QuizContext.jsx       # Quiz state, CRUD operations, attempt storage
│   ├── pages/
│   │   ├── Home.jsx              # Landing page
│   │   ├── Home.css              # Landing page styling (full-viewport hero)
│   │   ├── auth/
│   │   │   ├── Login.jsx         # Sign in page with quick demo fillers
│   │   │   ├── Signup.jsx        # User registration with role selection
│   │   │   └── Auth.css          # Auth styling
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx# Metrics and quick links
│   │   │   ├── CreateQuiz.jsx    # Quiz authoring interface
│   │   │   ├── EditQuiz.jsx      # Quiz editing interface
│   │   │   ├── ManageQuizzes.jsx # Quiz listing and delete actions
│   │   │   ├── QuestionEditor.jsx# Reusable question component
│   │   │   └── AdminReports.jsx  # Detailed analytics and attempts log
│   │   └── user/
│   │       ├── UserDashboard.jsx # Quiz catalogue
│   │       ├── TakeQuiz.jsx      # Timed quiz player interface
│   │       ├── QuizResult.jsx    # Score summary and question review
│   │       └── UserHistory.jsx   # Log of past quiz attempts
│   ├── App.jsx                   # Central route configurations
│   ├── main.jsx                  # React DOM mount point
│   └── index.css                 # Global styling, utility classes & design system
├── .gitignore                    # Git ignore file
├── index.html                    # Root HTML document
├── package.json                  # Dependencies & scripts
├── vercel.json                   # Vercel SPA routing rules
└── vite.config.js                # Vite build configuration
```

---

## 💻 Local Development Setup

To run this project locally on your system:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### 2. Clone the Repository
```bash
git clone https://github.com/2500031148/quiz-builder.git
cd quiz-builder
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## 🚀 Deployment Instructions (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Authenticate with Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy the application:**
   ```bash
   vercel
   ```
   - Set up and deploy? → `Yes`
   - Select your project scope / team
   - Link to existing project? → `No`
   - Project name? → `quiz-builder`
   - Directory location? → Press `Enter` (current directory)
   - Modify settings? → `No`

4. **Production Updates:**
   To redeploy subsequent code changes directly to production:
   ```bash
   vercel --prod
   ```

---

## 👨‍💻 Author

- **GitHub:** [@2500031148](https://github.com/2500031148)
- **Project:** Quiz Builder Web Application
- **Coursework:** Project Review 2
