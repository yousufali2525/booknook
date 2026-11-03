import mongoose, { Schema, Document, models, model, Model } from 'mongoose';
import { IBorrow } from '../types';
export interface IBorrowDocument extends Omit<IBorrow, '_id'>, Document {
  createdAt: Date;
  updatedAt: Date;
}
const borrowSchema = new Schema<IBorrowDocument>(
  {
    bookId: { 
      type: String, 
      required: [true, 'Book ID is required'], 
      trim: true 
    },
    bookTitle: { 
      type: String, 
      required: [true, 'Book title is required'], 
      trim: true 
    },
    bookImage: { 
      type: String, 
      required: [true, 'Book cover image is required'], 
      trim: true 
    },
    userEmail: { 
      type: String, 
      required: [true, 'User email is required'], 
      trim: true, 
      lowercase: true 
    },
    userName: { 
      type: String, 
      required: [true, 'User name is required'], 
      trim: true 
    },
    borrowDate: { 
      type: String, 
      required: [true, 'Borrow date is required'], 
      trim: true,
      default: () => new Date().toISOString().split('T')[0]
    },
    returnDate: { 
      type: String, 
      required: [true, 'Return date is required'], 
      trim: true 
    },
    status: { 
      type: String, 
      enum: ['active', 'returned'], 
      default: 'active' 
    },
  },
  {
    timestamps: true,
  }
);
borrowSchema.index(
  { userEmail: 1, bookId: 1 }, 
  { unique: true, partialFilterExpression: { status: 'active' } }
);
borrowSchema.index({ userEmail: 1, status: 1 });
borrowSchema.index({ bookId: 1, status: 1 });
borrowSchema.index({ createdAt: -1 });
export const Borrow: Model<IBorrowDocument> = (models.Borrow as Model<IBorrowDocument>) || model<IBorrowDocument>('Borrow', borrowSchema);
export default Borrow;