# AI Resume Analyzer & ATS Optimizer

[![Project Status](https://img.shields.io/badge/status-Milestone_1:_Scaffolding-blue.svg)](https://github.com/Abhigyan1951/AI-Resume-Analyzer-ATS)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**AI Resume Analyzer** is a full-stack web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). The application parses resumes (PDF/DOCX), evaluates them against specific job descriptions using **Google's Gemini AI**, calculates match scores, and provides actionable recommendations to improve resume visibility and recruiter response rates.

---

## 🚀 System Architecture & Tech Stack

### Frontend (`/frontend`)
- **Framework:** React 19 (scaffolded with [Vite](https://vite.dev/))
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (configured via `@tailwindcss/vite`)
- **Routing:** `react-router`
- **HTTP Client:** `axios`

### Backend (`/backend`)
- **Runtime:** Node.js (ES Modules `"type": "module"`)
- **Framework:** Express.js
- **Configuration:** `dotenv`, `cors`
- **Development Tooling:** `nodemon`

### Planned Stack (Upcoming Milestones)
- **Database:** MongoDB Atlas + Mongoose
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Authentication:** JWT + `bcryptjs`
- **File Upload & Parsing:** `multer`, `pdf-parse`, `mammoth`
- **Deployment Targets:** Vercel (Frontend), Render (Backend)

---

## 📁 Repository Structure

```text
AI-Resume-Analyzer-ATS/
├── frontend/                 # React SPA (Vite)
│   ├── src/
│   │   ├── assets/           # Static images & icons
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React Context providers (Auth, Global state)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── layouts/          # Page layout structures
│   │   ├── pages/            # View pages / routes
│   │   ├── services/         # API request services (Axios)
│   │   ├── utils/            # Helper functions & formatting utilities
│   │   ├── App.jsx           # Main App component
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Tailwind v4 import
│   ├── vite.config.js        # Vite & Tailwind v4 plugin configuration
│   └── package.json
├── backend/                  # Express API server
│   ├── config/               # Database & service configurations
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Auth, validation, upload middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express API endpoints
│   ├── services/             # Gemini AI & business logic
│   ├── utils/                # Server helpers & error handlers
│   ├── uploads/              # Local upload storage directory
│   ├── server.js             # Express server entry point
│   ├── .env.example          # Environment variable template
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🛠️ Getting Started (Local Development)

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher

### 1. Clone the Repository
```bash
git clone https://github.com/Abhigyan1951/AI-Resume-Analyzer-ATS.git
cd AI-Resume-Analyzer-ATS
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in `/backend` based on `.env.example`:
```env
PORT=5000
```
Start the development server:
```bash
npm run dev
```
The backend API will run at `http://localhost:5000`. You can test the health endpoint at `http://localhost:5000/`.

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The Vite dev server will run at `http://localhost:5173`.

---

## 📋 Development Roadmap

- [x] **Milestone 1:** Project Scaffolding & Architecture setup (Frontend + Backend)
- [ ] **Milestone 2:** User Authentication & Authorization (JWT + bcryptjs)
- [ ] **Milestone 3:** Resume Upload & Parsing Engine (PDF/DOCX)
- [ ] **Milestone 4:** Gemini AI Integration & ATS Scoring Engine
- [ ] **Milestone 5:** User Dashboard & Historical Analysis Persistence
- [ ] **Milestone 6:** Production Deployment & CI/CD Setup

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
