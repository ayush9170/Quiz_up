# 🧠 Real-Time Multiplayer AI Quiz Platform

A web application where users can **log in with Google**, generate quizzes using **GPT-4**, and play them in **real-time multiplayer rooms** with friends.  
Built for fast, interactive quiz battles with live updates powered by **Pusher**.

---

## ✨ Features

- 🔐 **Google Authentication** for quick and secure login
- 🤖 **AI-Generated Quizzes** powered by GPT-4
- 🎮 **Multiplayer Quiz Rooms** with real-time gameplay
- ⚡ **Instant updates** using Pusher channels
- 🎨 Clean and responsive UI built with Tailwind CSS
- 🗄 Data stored in MongoDB using Prisma ORM

---

## 🛠 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | Next.js, Tailwind CSS |
| Backend | Node.js, Next.js API Routes |
| Auth | Google OAuth (NextAuth if used) |
| Database | MongoDB + Prisma ORM |
| Real-Time | Pusher |
| AI | GPT-4 API |
| Version Control | Git + GitHub |

---

## 📦 Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/ai-quiz-app.git

cd ai-quiz-app
---
# 2.Set environment variables in .env:

DATABASE_URL="your_mongodb_connection_string"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
PUSHER_APP_ID="your_pusher_app_id"
PUSHER_KEY="your_pusher_key"
PUSHER_SECRET="your_pusher_secret"
PUSHER_CLUSTER="your_pusher_cluster"
OPENAI_API_KEY="your_gpt4_api_key"
NEXTAUTH_SECRET="your_random_secret"
NEXTAUTH_URL="http://localhost:3000"

---

# Run the App
 npm run dev

---
# Install dependencies
npm install
