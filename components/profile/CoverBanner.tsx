'use client';

export function CoverBanner() {
  return (
    <div className="relative h-64 rounded-3xl overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop"
        alt="Mountains"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
      
      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h2 className="text-6xl font-black text-white tracking-wider mb-6">
          MOUNTAINS
        </h2>
        <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full text-sm font-semibold hover:from-pink-600 hover:to-pink-700 transition-all shadow-xl">
          Featured Collection
        </button>
      </div>
    </div>
  );
}