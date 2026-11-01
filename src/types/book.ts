export interface Book {
  id: string;
  _id?: string;
  title: string;
  author: string;
  image?: string;
  coverUrl?: string;
  category: string;
  totalCopies?: number;
  availableCopies?: number;
  status: 'available' | 'borrowed' | 'reserved';
  ownerName: string;
  ownerAvatar?: string;
  userName?: string;
  userEmail?: string;
  rating: number;
  condition: 'Like New' | 'Gently Used' | 'Well Read';
  description: string;
  sharedAt?: string;
  createdAt?: string;
}

export interface SlideData {
  id: number;
  badge: string;
  title: string;
  highlightText?: string;
  subtitle: string;
  ctaText: string;
  secondaryCtaText?: string;
  bgImage: string;
}