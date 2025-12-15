'use client';

export function CollectionsCarousel() {
  const collections = [
    {
      id: 1,
      title: 'Savana',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=200&h=200&fit=crop',
      count: 12,
    },
    {
      id: 2,
      title: 'Streets',
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200&h=200&fit=crop',
      count: 8,
    },
    {
      id: 3,
      title: 'Squares',
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=200&fit=crop',
      count: 15,
    },
    {
      id: 4,
      title: 'Nature',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
      count: 24,
    },
    {
      id: 5,
      title: 'Urban',
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=200&h=200&fit=crop',
      count: 18,
    },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
        Popular Collections
      </h3>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {/* Add Collection Button */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-center mt-3">
            <p className="text-xs font-semibold text-gray-900">Savana</p>
          </div>
        </div>

        {/* Collection Items */}
        {collections.map((collection) => (
          <div key={collection.id} className="flex-shrink-0">
            <div className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform">
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center mt-3">
              <p className="text-xs font-semibold text-gray-900">{collection.title}</p>
            </div>
          </div>
        ))}

        {/* View More */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
            <span className="text-sm font-semibold text-gray-600">View<br/>more</span>
          </div>
        </div>
      </div>
    </div>
  );
}