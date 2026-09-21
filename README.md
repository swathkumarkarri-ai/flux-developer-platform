# FLUX — Mobile-First Agentic Developer Platform

FLUX is an autonomous AI developer console built with a mobile-first architecture (412x892 viewport) and a high-contrast dark console design. It automates the full deployment pipeline: **Git Ingestion → AST Analysis → API Test Synthesis → Root Cause Diagnosis → Production Gate**.

---

## ⚡ Tech Stack

- **Frontend:** React 18, Vite, Custom Dark/Flame CSS State Machine
- **Backend:** Node.js, Express 5, `simple-git`, `diff`
- **Containerization:** Multi-stage Docker build
- **Deployment:** Render Web Service

---

## 🛠 Features & 9-Screen Workflow

1. **Brand Intro:** Splash entry and console initialization
2. **Workspace:** Active repository matrix (E-Commerce, Chat Microservice)
3. **Connect Git:** Shallow clone integration for public/private Git repositories
4. **AI Spec Analyzer:** AST route discovery and database introspection
5. **API Testing Spec:** Automated matrix generation across discovered endpoints
6. **Execution Verdict:** Pass/Fail analytics with failure payload breakdown
7. **Autonomous Patch:** Zod validation patch synthesis with unified diff review
8. **Deployment Gate:** 100% confidence health check verification
9. **Live Dashboard:** Real-time container metrics, live logs, APIs, and P99 latency

---

## 🚀 Local Development

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/swathkumarkarri-ai/flux-developer-platform.git
cd flux-developer-platform
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd ../frontend/ui
npm install
npm run dev
\`\`\`

---

## 🐳 Docker Deployment

Build and run the entire unified platform via Docker:

\`\`\`bash
docker build -t flux-platform .
docker run -p 5000:5000 flux-platform
\`\`\`