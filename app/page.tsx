import HeroSlider from '@/components/home/HeroSlider';
import NewArrivals from '@/components/home/NewArrivals';
import HowBorrowingWorks from '@/components/home/HowBorrowingWorks';
import TopCategories from '@/components/home/TopCategories';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-16">
      <HeroSlider />
      <NewArrivals />
      <HowBorrowingWorks />
      <TopCategories />
    </div>
  );
}