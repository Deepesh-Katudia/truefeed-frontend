'use client';

export function StoryBar() {
  const stories = [
    {
      id: 1,
      name: 'Sam Brown',
      image: 'https://images.unsplash.com/photo-1583468982228-19f19164aee2?w=300&h=400&fit=crop',
      avatar: 'https://i.pravatar.cc/100?u=sam',
    },
    {
      id: 2,
      name: 'Laura Fisher',
      image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=300&h=400&fit=crop',
      avatar: 'https://i.pravatar.cc/100?u=laura',
      hasLike: true,
    },
    {
      id: 3,
      name: 'Diana Vooss',
      image: 'https://images.unsplash.com/photo-1569429593155-b2efc0ae1e00?w=300&h=400&fit=crop',
      avatar: 'https://i.pravatar.cc/100?u=diana',
    },
    {
      id: 4,
      name: 'Roger Miller',
      image: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=300&h=400&fit=crop',
      avatar: 'https://i.pravatar.cc/100?u=roger',
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {/* Add Story Card */}
        <div className="flex-shrink-0 w-32">
          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Add Story</span>
            </div>
          </div>
        </div>

        {/* Story Cards */}
        {stories.map((story) => (
          <div key={story.id} className="flex-shrink-0 w-32">
            <div className="relative h-48 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group">
              <img
                src={story.image}
                alt={story.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
              
              {/* Avatar */}
              <div className="absolute top-3 left-3">
                <div className="relative">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  {story.hasLike && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center border-2 border-white">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-semibold truncate">{story.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}