# 📚 BookNook – A Small Online Library

**Live Website:** https://booknook-22-cc8a.vercel.app/  
**Client Repository:** https://github.com/yousufali2525/booknook  
**Server Repository:** https://github.com/yousufali2525/booknook-server  
**Backend API:** https://booknook-server-34u5.onrender.com

## 📖 Project Overview

BookNook is a small online library where users can explore books, add new books, borrow books for a few days, and return borrowed books. Users can also manage the books they have added and track their borrowing history.

The main goal of this project is to provide a simple and user-friendly online library experience.

## ✨ Main Features

- **User Authentication:** Register and log in using email and password with BetterAuth.
- **Google Login:** Sign in using a Google account.
- **User Profile:** View profile information and manage account details.
- **Home Page:** Explore a banner slider, latest books, top categories, and borrowing information.
- **Latest Books:** Display the six newest books from the database.
- **All Books:** Browse all available books with search, filtering, sorting, and grid/table views.
- **Book Details:** View book information, including title, author, category, description, and availability.
- **Add Books:** Logged-in users can add books with images, descriptions, categories, and total copies.
- **My Books:** Users can view and manage the books they have added.
- **Update Books:** Edit existing book information.
- **Delete Books:** Delete books using a custom confirmation modal.
- **Borrow Books:** Borrow available books through a confirmation modal.
- **My Borrows:** View borrowed books with borrowing and return dates.
- **Return Books:** Return borrowed books and update book availability.
- **Available Copies:** Automatically decrease available copies when a book is borrowed and increase them when returned.
- **Duplicate Borrow Prevention:** Prevent users from borrowing the same book twice at the same time.
- **Protected Routes:** Restrict private pages to authenticated users.
- **JWT Authentication:** Protect private backend API routes with token validation.
- **Image Upload:** Upload book cover images through the backend upload system.
- **Loading Spinner:** Display loading indicators while data is being fetched.
- **Custom 404 Page:** Show a custom Not Found page with a Back to Home button.
- **Responsive Design:** Support mobile, tablet, and desktop devices.
- **Toast Notifications:** Display success and error messages without using default browser alerts.

## 🛠️ Technology Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Authentication & Authorization
- BetterAuth
- MongoDB Adapter
- Google OAuth
- JWT

### Backend
- Node.js
- Express.js
- MongoDB
- JavaScript

### Deployment
- Vercel – Frontend Hosting
- Render – Backend Hosting
- MongoDB Atlas – Database

## 🔐 Authentication System

BookNook uses BetterAuth with the MongoDB Adapter for user authentication.

Authentication features include:

- User registration with name, email, photo URL, and password.
- Password validation requiring uppercase, lowercase, and at least 6 characters.
- Email and password login.
- Google authentication.
- Protected routes for authenticated users.
- Session persistence after page reload.
- Login redirection when accessing private routes without authentication.
- Forgot Password interface (functionality not implemented, as allowed by the assignment).

## 📚 Book Management System

Users can perform the following operations:

| Operation | Description |
|---|---|
| Create | Add a new book |
| Read | View all books and book details |
| Update | Edit books added by the logged-in user |
| Delete | Delete books added by the logged-in user |

Each book contains information such as title, author, category, image, description, user information, date added, total copies, and available copies.

## 🔄 Borrowing System

The borrowing system allows authenticated users to borrow available books.

- Users can borrow a book from its details page.
- Borrowing information is saved in the MongoDB `borrows` collection.
- Each borrowing record contains book ID, book title, book image, user email, borrow date, and return date.
- Available copies decrease when a book is borrowed.
- Available copies increase when a book is returned.
- Users cannot borrow the same book twice while an active borrowing record exists.
- The Borrow button is disabled when no copies are available.

## 🌐 Backend API Routes

Base URL:

`https://booknook-server-34u5.onrender.com/api`

### Books API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books` | Get all books |
| GET | `/books/:id` | Get a single book |
| POST | `/books` | Add a new book |
| PATCH | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |

### Borrow API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/borrows` | Borrow a book |
| GET | `/borrows` | Get borrowed books of the logged-in user |
| DELETE | `/borrows/:id` | Return a borrowed book |

Private API routes use JWT token validation.

## 🗂️ Database Collections

The application uses MongoDB Atlas.

Main collections include:

- `books` – Stores book information.
- `borrows` – Stores borrowing records.
- `user` – Stores BetterAuth user information.
- `session` – Stores user sessions.
- `account` – Stores authentication account information.

## ⚙️ Installation and Setup

### 1. Clone the Client Repository

```bash
git clone https://github.com/yousufali2525/booknook.git
cd booknook
```

### 2. Install Client Dependencies

```bash
npm install
```

### 3. Configure Client Environment Variables

Create a `.env.local` file in the client project root.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=booknook
BETTER_AUTH_SECRET=your_better_auth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Run the Client Application

```bash
npm run dev
```

Open:

`http://localhost:3000`

### 5. Clone the Server Repository

Open another terminal:

```bash
git clone https://github.com/yousufali2525/booknook-server.git
cd booknook-server
```

### 6. Install Server Dependencies

```bash
npm install
```

### 7. Configure Server Environment Variables

Create a `.env` file in the backend project root.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=booknook
JWT_SECRET=your_jwt_secret
```

Add any other environment variables required by your backend configuration.

### 8. Run the Backend Server

```bash
npm run dev
```

The backend will run at:

`http://localhost:5000`

**Note:** Never upload `.env` or `.env.local` files containing secret credentials to GitHub.

## 🚀 Deployment

- Frontend deployed on Vercel.
- Backend deployed on Render.
- Database hosted on MongoDB Atlas.

## 📱 Responsive Design

BookNook is designed to work across different screen sizes:

- Mobile devices
- Tablets
- Desktop computers

The layout uses responsive grids, flexible components, and consistent spacing for a smooth user experience.

## 📌 Assignment Requirements

- Next.js App Router frontend.
- Express.js and MongoDB backend.
- BetterAuth authentication with MongoDB Adapter.
- Google OAuth login.
- Protected private routes.
- Book CRUD operations.
- Borrow and return functionality.
- JWT validation for protected APIs.
- Loading spinner and custom 404 page.
- Route-specific page titles.
- Responsive user interface.
- Client-side minimum 15 meaningful GitHub commits.
- Server-side minimum 8 meaningful GitHub commits.

## 👨‍💻 Developer

**GitHub:** https://github.com/yousufali2525  
**Email:** yousufali025250@gmail.com  
**Location:** Rajshahi, Bangladesh

---

© 2026 BookNook Library. All rights reserved.