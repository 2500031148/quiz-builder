# Quiz Builder

A full-featured interactive quiz platform built with **React + Vite**.

## Features

- 🔐 **Auth** — Login & Signup with Local Storage (no backend required)
- 👑 **Admin Module** — Create, edit, delete quizzes; view reports
- 👤 **User Module** — Browse, take quizzes; view history & results
- ❓ **Question Types** — Multiple Choice, True/False, Open-Ended
- 🔀 **Randomization** — Shuffle questions per quiz attempt
- ⏱️ **Timer** — Per-quiz time limits with live countdown
- 📊 **Reports** — Admin analytics; user score history

## Demo Accounts

| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@quiz.com     | admin123  |
| User  | user@quiz.com      | user123   |

> Sign up with any email to create a new account.

## Run Locally

```bash
npm install
npm run dev
```

## Deploy on Vercel

```bash
npm install -g vercel
vercel login     # login through GitHub
vercel           # follow prompts
```

## Tech Stack

- React 18 + React Router v6
- Vite 6
- CSS Custom Properties (no external UI library)
- LocalStorage for data persistence

