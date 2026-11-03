import Link from 'next/link';
import {
  BookOpen,
  Atom,
  Landmark,
  Baby,
  Layers,
} from 'lucide-react';
const categories = [
  {
    name: 'Fiction',
    count: '1,200+ Books',
    icon: BookOpen,
    color: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    name: 'Science',
    count: '850+ Books',
    icon: Atom,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    name: 'History',
    count: '640+ Books',
    icon: Landmark,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    name: 'Kids',
    count: '420+ Books',
    icon: Baby,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    name: 'Others',
    count: '910+ Books',
    icon: Layers,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
];
export function TopCategories() {
  return (
    <section className="w-full space-y-5 sm:space-y-6">
      <div className="text-center max-w-xl mx-auto px-2">
        <span className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-amber-700"> Explore Genres
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">  Top Categories </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">  Find your next favorite read organized by popular subjects. </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href={`/books?category=${encodeURIComponent(cat.name)}`}
              className="min-w-0 p-3 sm:p-4 lg:p-5 rounded-xl border border-stone-200 bg-white hover:border-amber-500 hover:shadow-md transition-all group text-center flex flex-col items-center justify-center gap-2 sm:gap-3">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border ${cat.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-xs sm:text-sm text-stone-800 group-hover:text-amber-800 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">
                  {cat.count}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
export default TopCategories;