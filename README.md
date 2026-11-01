# 📚 BookNook - Community Library & Book Sharing Platform

[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

BookNook is a modern full-stack web application designed for avid readers and community libraries. It empowers users to discover compelling titles, share their personal bookshelf, borrow books with dynamic date scheduling, and manage reading histories seamlessly.

---

## 🔗 Important Links

- **Live Application:** [https://booknook-library.vercel.app](https://booknook-library.vercel.app) *(আপনার লাইভ Vercel/Firebase সাইট লিংক এখানে দিন)*
- **Client Repository:** [https://github.com/your-username/booknook-client](https://github.com/your-username/booknook-client) *(আপনার ক্লায়েন্ট রিপোজিটরি লিংক)*
- **Server Repository:** [https://github.com/your-username/booknook-server](https://github.com/your-username/booknook-server) *(আপনার ব্যাকএন্ড সার্ভার রিপোজিটরি লিংক)*

---

## ✨ Key Features

- **🔐 User Authentication & Authorization:**
  - Secure registration and login powered by Context API and token authentication.
  - Dynamic navigation bar updating immediately based on user login status.
  - Route protection preventing unauthenticated users from borrowing or adding books.

- **📖 Dynamic Book Catalog & Filtering:**
  - Explore books with instant categorization (Fiction, Science, History, Philosophy, Technology, Fantasy).
  - Search books by title and author.
  - Live availability counters showing remaining copies in real time.

- **📑 Dynamic Book Details Route (`/books/[id]`):**
  - High-resolution cover artwork, author information, and book synopsis.
  - Stock verification preventing borrowing when available copies reach zero.
  - Contributor attribution acknowledging community members who added books.

- **🤝 Interactive Borrow System:**
  - Modal-based borrowing flow pre-filling borrower name and email.
  - Return date calendar picker with past-date prevention.
  - Instant decrement of available stock upon successful borrow.

- **📦 My Borrows Management (`/my-borrows`):**
  - Dedicated personal dashboard displaying all active loans.
  - Visual status badges (Active, Overdue, Returned).
  - One-click return book functionality that automatically restores available copies to the community shelf.

- **➕ Community Book Contribution (`/add-book`):**
  - Form validation with live image preview.
  - Automatic attribution to the logged-in user.

- **🎨 Modern Dark Mode & Responsive UI:**
  - Carefully crafted dark aesthetic optimized for readability.
  - 100% mobile, tablet, and desktop responsive layouts.
  - Custom branded 404 page for non-existent routes.

---

## 🛠️ Technology Stack

### Frontend:
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Context API (`AuthProvider`)

### Backend & Database:
- **Runtime:** Node.js
- **Server Framework:** Express.js
- **Database:** MongoDB (via MongoDB Atlas)
- **ODM:** Mongoose

---

## 🚀 Getting Started (Run Locally)

Follow these steps to run the application on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/booknook.git
cd booknook