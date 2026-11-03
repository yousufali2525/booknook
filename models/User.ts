import mongoose, { Schema, Document, models, model, Model } from 'mongoose';
import { IUser } from '../types';
export interface IUserDocument extends Omit<IUser, '_id' | 'createdAt'>, Document {
  createdAt: Date;
  updatedAt: Date;
}
const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    photoURL: {
      type: String,
      default: '',
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        delete ret.passwordHash;
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret: any) => {
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);
export const User: Model<IUserDocument> =
  (models.User as Model<IUserDocument>) || model<IUserDocument>('User', userSchema);
export default User;