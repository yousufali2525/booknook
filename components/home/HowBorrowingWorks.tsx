import {
  Search,
  BookmarkCheck,
  RotateCcw,
} from 'lucide-react';

export function HowBorrowingWorks() {
  const steps = [
    {
      step: '01',
      title: 'Discover & Choose',
      description:
        'Search our community catalog across Fiction, Science, History and more. Find the next book you want to read.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Borrow with 1-Click',
      description:
        'Logged-in members can click "Borrow This Book", select an estimated return date, and instantly reserve it.',
      icon: BookmarkCheck,
    },
    {
      step: '03',
      title: 'Read & Return',
      description:
        'Enjoy your book anytime. When finished, visit your "My Borrows" shelf and click "Return Book" in seconds.',
      icon: RotateCcw,
    },
  ];

  return (
    <section className="w-full bg-stone-100/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 border border-stone-200">
      <div className="max-w-2xl mx-auto text-center mb-6 sm:mb-8 md:mb-10">
        <span className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-amber-700">
          Simple Workflow
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
          How Borrowing Works
        </h2>

        <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
          Three simple steps to read any book in our community catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {steps.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.step}
              className="bg-white p-4 sm:p-5 md:p-6 rounded-xl border border-stone-200/80 shadow-xs relative flex flex-col justify-between min-w-0 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <span className="font-serif text-xl sm:text-2xl font-bold text-stone-300">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default HowBorrowingWorks;