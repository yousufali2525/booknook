import mongoose, { Schema, Document, models, model, Model } from 'mongoose';
import { IBook } from '../types';
export interface IBookDocument extends Omit<IBook, '_id' | 'createdAt'>, Document {
  createdAt: Date;
  updatedAt: Date;
}
const bookSchema = new Schema<IBookDocument>(
  {
    title: { 
      type: String, 
      required: [true, 'Book title is required'], 
      trim: true 
    },
    author: { 
      type: String, 
      required: [true, 'Author name is required'], 
      trim: true 
    },
    category: { 
      type: String, 
      required: true,
      enum: ['Fiction', 'Science', 'History', 'Kids', 'Others', 'Business', 'Design'], 
      default: 'Fiction' 
    },
    image: { 
      type: String, 
      required: [true, 'Book cover image is required'], 
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, 'Book description is required'], 
      trim: true 
    },
    totalCopies: { 
      type: Number, 
      required: true, 
      min: [1, 'Total copies must be at least 1'], 
      default: 1 
    },
    availableCopies: { 
      type: Number, 
      required: true, 
      min: [0, 'Available copies cannot be negative'], 
      default: 1 
    },
    userName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    userEmail: { 
      type: String, 
      required: true, 
      trim: true, 
      lowercase: true 
    },
    rating: { 
      type: Number, 
      min: 0, 
      max: 5, 
      default: 4.8 
    },
  },
  {
    timestamps: true,
  }
);
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ category: 1 });
bookSchema.index({ userEmail: 1 });
bookSchema.index({ createdAt: -1 });
export const Book: Model<IBookDocument> = (models.Book as Model<IBookDocument>) || model<IBookDocument>('Book', bookSchema);
export default Book;