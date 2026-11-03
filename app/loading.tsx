export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#faf8f5] px-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-[#c85a32]/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#c85a32] animate-spin" />
      </div>
      <h2 className="mt-6 text-xl font-serif font-bold text-[#2c2420]">  BookNook  </h2>
      <p className="mt-2 text-sm text-stone-500">  Preparing your library... </p>
    </div>
  );
}