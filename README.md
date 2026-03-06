# TrueFeed – Frontend (Next.js)

TrueFeed is a full-stack social media platform that allows users to create posts, upload stories, manage friends, and check content credibility using AI before publishing.

This repository contains the **Next.js frontend application** built with modern React architecture and JWT-based authentication.

---

## 🎥 Project Demo

Watch the full working demo of the project here:

👉 **YouTube Demo:**  
(https://youtu.be/PMiKg-sIGtQ)

---

## 🚀 Features

- 🔐 JWT-based authentication (Login / Register)
- 📝 Create posts (with optional media upload)
- 🤖 AI credibility check before posting
- ❤️ Like & comment on posts
- 📸 Instagram-style stories
- 👥 Friend search and request system
- 👤 Profile management
- 📂 Media rendering via backend streaming
- 📱 Fully responsive UI
- ⚡ Real-time UI updates

---

## 🛠 Tech Stack

- Next.js (App Router)
- React (TypeScript)
- Tailwind CSS
- JWT Authentication
- Fetch / API Layer Abstraction
- RESTful API integration

---

## ⚙️ Getting Started

### 1️⃣ Install dependencies

```bash
npm install
````

### 2️⃣ Setup Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

This should point to your backend server.

### 3️⃣ Run the development server

```bash
npm run dev
```

Open your browser:

```
http://localhost:3000
```

---

## 📂 Project Structure

```
truefeed-frontend/
 ├── app/                # Next.js app router pages
 ├── components/         # Reusable UI components
 ├── lib/                # API utilities
 ├── hooks/              # Custom React hooks
 ├── public/             # Static assets
 └── styles/             # Global styles
```

---

## 🔐 Authentication Flow

1. User logs in or registers.
2. Backend returns JWT token.
3. Frontend stores token.
4. Token is sent in `Authorization` header for protected API requests.
5. Backend verifies token before allowing access.

---

## 🧠 AI Credibility Feature

Before creating a post:

1. Frontend sends content to backend AI endpoint.
2. Backend returns credibility score and status.
3. AI result is stored with the post.
4. Feed displays saved credibility badge without re-checking.

---

## 🔗 Backend Repository

Make sure the backend server is running:

```
http://localhost:4000
```

Backend repository:
[https://github.com/your-username/truefeed-backend](https://github.com/Deepesh-Katudia/truefeed_backend)

---

## 🚀 Deployment

Recommended platform:

* Vercel (for frontend)

Build command:

```bash
npm run build
```

---

## 👨‍💻 Author

Deepesh Katudia
Software Developer

```

---

When you are ready, send me your YouTube link and I can format it as:

- clickable thumbnail preview
- embedded GIF preview
- or add badges for GitHub polish

Next we can prepare the backend README.
```
