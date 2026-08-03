# TechOS - Complete Deployment Guide

## 🎉 Project Overview

**TechOS** - The Operating System for Software Companies
A complete management platform with AI-powered assistant.

### Components

1. **Backend** - NestJS + TypeScript + SQLite/PostgreSQL
2. **Frontend** - Next.js 14 + TypeScript + Tailwind CSS

---

## 🚀 Backend Setup (Port 4000)

### Location
```
cd c:\Users\HP\Desktop\techos\server-nest
```

### Prerequisites
- Node.js 18+
- Redis (optional - for caching)

### Installation
```bash
npm install
```

### Environment Configuration
Edit `.env` file and configure:

```env
# Required
PORT=4000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AI Providers (Add at least one)
OPENAI_API_KEY=sk-...          # OpenAI GPT-4
ANTHROPIC_API_KEY=sk-ant-...   # Claude
GEMINI_API_KEY=...             # Google Gemini
GROK_API_KEY=...               # xAI Grok

# Optional Services
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=...
```

### Running

**Development:**
```bash
npm run start:dev
```

**Production:**
```bash
npm run build
npm run start:prod
```

### Access
- **Server:** http://localhost:4000
- **API Docs (Swagger):** http://localhost:4000/api/docs

---

## 🎨 Frontend Setup (Port 3000)

### Location
```
cd c:\Users\HP\Desktop\techos\frontend
```

### Installation
```bash
npm install --legacy-peer-deps
```

### Environment Configuration
Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

### Running

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

### Access
- **Frontend:** http://localhost:3000

---

## 📊 Backend Features (100% Complete)

### Core Modules (28 modules, 200+ endpoints)

✅ **Infrastructure**
- Docker & Docker Compose
- Redis caching
- Cloudinary file uploads
- Resend email service
- WebSocket (Socket.IO)
- JWT authentication

✅ **Project Management**
- Projects, Tasks, Sprints
- Subtasks, dependencies
- Time tracking
- Kanban boards

✅ **Collaboration**
- Real-time messaging (WebSocket)
- Channels (public/private/direct)
- Meetings with participants
- Notifications (real-time + email)

✅ **Business Management**
- CRM (Contacts, Deals, Pipeline)
- Finance (Invoices, Expenses, Budgets)
- HR (Employees, Leave Requests)
- Documents (with versioning)
- Calendar & Events

✅ **Planning**
- Goals & OKRs
- KPI tracking
- Announcements
- Company roadmaps

✅ **Product Management**
- Features, Epics, Bugs
- Releases & Roadmaps
- Customer feedback
- Feature voting

✅ **Analytics & Intelligence**
- Project analytics
- Team productivity
- Sprint velocity
- Financial reports
- Custom dashboards (5 role-based)

✅ **AI Assistant**
- Multi-provider support (OpenAI, Claude, Gemini, Grok)
- Complete system understanding
- Natural language queries
- Risk analysis
- Priority suggestions
- Automated report generation

✅ **Integrations**
- GitHub, GitLab
- Google Calendar, Outlook
- Zoom, Google Meet
- Slack, Discord
- Stripe, QuickBooks
- OAuth & Webhooks

---

## 🎯 Frontend Features (Initial Release)

✅ **Implemented**
- Authentication (Login/Register)
- Protected routes
- Dashboard layout
- Sidebar navigation
- Header with search
- Main dashboard with stats
- Black & White theme
- Responsive design

🔜 **Coming Next** (Ready for Integration)
- Projects list & detail
- Task board (Kanban)
- Sprint planning
- Calendar view
- Messaging interface
- CRM dashboard
- Finance dashboard
- AI chat interface
- All other modules

---

## 🔑 First Time Setup

### 1. Start Backend
```bash
cd server-nest
npm run start:dev
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Create Account
- Open http://localhost:3000
- Click "Sign up"
- Fill in details
- Your organization is automatically created!

### 4. Add AI API Key (Optional)
```bash
# In server-nest/.env
OPENAI_API_KEY=sk-your-key-here
```

### 5. Explore
- **API Documentation:** http://localhost:4000/api/docs
- **Dashboard:** http://localhost:3000/dashboard

---

## 🗄️ Database

- **Type:** SQLite (default) or PostgreSQL
- **Location:** `server-nest/techos.db`
- **Auto-created:** Tables created automatically on first run
- **30+ Tables:** All entities ready

---

## 🐳 Docker Deployment (Optional)

```bash
cd server-nest
docker-compose up -d
```

Includes:
- Backend service
- Redis cache
- PostgreSQL database (if configured)

---

## 🎨 Design System

### Colors
- **Primary:** Black (#000000)
- **Secondary:** White (#ffffff)
- **Grays:** 50-900 scale

### Theme
- Minimal & professional
- Clean borders
- Smooth transitions
- Responsive on all devices

---

## 📝 API Testing

### Using Swagger UI
1. Go to http://localhost:4000/api/docs
2. Click "Authorize"
3. Get token from `/auth/login`
4. Paste token as `Bearer YOUR_TOKEN`
5. Test any endpoint!

### Using cURL
```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","first_name":"John","last_name":"Doe","organization_name":"My Company"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 🤖 AI Assistant Usage

### Ask Anything
```bash
POST /api/ai/chat
{
  "message": "What's our project completion rate?",
  "provider": "openai"  # openai, claude, gemini, or grok
}
```

### Generate Reports
```bash
GET /api/ai/generate-report?type=executive&provider=claude
```

### Risk Analysis
```bash
GET /api/ai/analyze-risk?provider=openai
```

---

## 🔧 Troubleshooting

### Backend won't start
- Check if port 4000 is available
- Verify Node.js version (18+)
- Run `npm install`

### Frontend won't start
- Check if port 3000 is available
- Run `npm install --legacy-peer-deps`
- Verify `.env.local` exists

### Redis errors (non-critical)
- Redis is optional
- Start with `docker-compose up -d redis`
- Or ignore - system works without it

### AI not working
- Add API key to `.env`
- Restart backend
- Check API key is valid

---

## 📚 Documentation

- **Backend API:** http://localhost:4000/api/docs
- **Frontend README:** `/frontend/README.md`
- **Backend README:** `/server-nest/README.md`
- **AI Setup:** `/server-nest/AI_SETUP_README.md`

---

## 🎯 Next Steps

1. ✅ Create your account
2. ✅ Explore the dashboard
3. ✅ Test API endpoints via Swagger
4. ✅ Add AI API key
5. ✅ Start building your team!

---

## 💡 Tips

- Use Swagger UI for easy API testing
- AI works best with real data - add some projects/tasks first
- Check `/api/docs` for complete API reference
- Frontend is ready for module integration
- All 28 backend modules are fully functional

---

**You're all set! Welcome to TechOS!** 🚀
