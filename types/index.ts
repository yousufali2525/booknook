export type BookCategory = 'Fiction' | 'Science' | 'History' | 'Kids' | 'Others' | 'Business' | 'Design';
export interface IBook {
  _id: string;
  title: string;
  author: string;
  category: BookCategory;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  userName: string;
  userEmail: string;
  createdAt: string;
  rating?: number;
}
export interface IBorrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
  status: 'active' | 'returned';
}
export interface IUser {
  _id: string;
  name: string;
  email: string;
  photoURL?: string;
  passwordHash?: string;
  createdAt: string;
}
