# NexBot 🤖 — AI-Powered Text Chatbot App

NexBot is an **AI-powered, text-based chat application** built using the latest modern web technologies. Designed for speed, security, and customization, NexBot brings a responsive, intuitive experience for chatting with AI using state-of-the-art tools and frameworks.

## 🚀 Features

- 🧠 **AI-Powered Chatting** (via Gemini API)
- 🔐 **Secure Authentication** with [Auth.js](https://authjs.dev) / NextAuth
- 🗂️ **User Profile & Chat History**
- 📁 **Private/Public Shareable Chat Links**
- 🌟 **Favorite Messages & Chats**
- 🧾 **Admin Dashboard** (stats, analytics, management)
- 🔍 **Search & Filter Chats**
- ✏️ **Edit/Delete Messages**
- 🧑‍💻 Built for both **users** and **admins**

---

## 🛠 Tech Stack

| Tool             | Description                                      |
|------------------|--------------------------------------------------|
| **Next.js 15**   | App Router enabled frontend & backend framework  |
| **TypeScript**   | Type-safe JavaScript for maintainable code       |
| **Drizzle ORM**  | SQL ORM for working with MySQL                   |
| **MySQL**        | Relational database for secure, structured data  |
| **Auth.js**      | Auth framework with email + credentials support  |
| **ShadCN UI**    | Clean, accessible UI components                  |
| **Tailwind CSS** | Utility-first styling for responsive design      |
| **Zod**          | Schema validation for forms and backend logic    |
| **useSWR**       | Data fetching hooks with caching                 |

---

## 📁 Folder Structure (Highlights)

```bash
nexbot/
├── app/                     # App Router structure (pages, layouts, routes)
│   ├── chat/                # Chat interface, search, profile pages
│   ├── api/                 # Server functions (auth, user, chats, admin)
├── components/              # Reusable UI components
├── lib/                     # Utility functions, hooks, DB config
│   ├── hooks/               # Custom React hooks (e.g. useShortcuts)
│   ├── db.ts                # Drizzle ORM config
├── drizzle/                 # Drizzle schema & migration files
├── public/                  # Static assets (images, logos)
├── styles/                  # Global CSS
└── .env.example             # Sample environment variables
```
## 📦 Installation
```bash
# 1. Clone the repo
git clone https://github.com/CodifyCanvas/NexBot-Ai.git
cd nexbot-ai

# 2. Install dependencies
npm install

# 3. Set up .env file
cp .env.example .env.local
# Fill in your DATABASE_URL, AUTH_SECRET, GEMINI_API_KEY, etc.

# 4. Run Drizzle migrations
npx drizzle-kit push

# 5. Run dev server
npm run dev
```

## 🌐 Environment Variables (.env)
```bash
# Database
DATABASE_URL=
MYSQL_HOST=
MYSQL_PORT=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=
MYSQL_CA_CERT=

# Auth.js
AUTH_SECRET=

# Gemini API Key
GEMINI_API_KEY=

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000 <---(for locally run)
```

## ✨ Keyboard Shortcuts

| Shortcut | Action             |
|----------|--------------------|
| Alt + C  | Go to Chat Page    |
| Alt + S  | Go to Search Page  |
| Alt + P  | Go to Profile Page |

## 🔐 Authentication

Credentials-based login
Secure sessions using Auth.js
Middleware protected routes
Admin access control

## 📄 License & Usage
This project is free to use, clone, modify, and extend for personal or educational use.
Feel free to create your own AI chatbot, improve the UI/UX, or plug in your own AI API key.

## 💬 Credits
Built with 💙 by Shahzaib Awan

NexBot is an AI-powered text-based chat application built with modern web technologies, including TypeScript, Next.js 15 (App Router), Drizzle ORM (MySQL), Auth.js/NextAuth for authentication, ShadCN UI for sleek UI components, and Zod for schema validation. Fast, secure, and fully customizable—designed for modern web AI experiences.
