'use client';

export function MembershipCard() {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
        Aniruddha appears in these teams
      </h3>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <div className="flex items-start gap-6">
          {/* Lion Image */}
          <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=200&h=200&fit=crop"
              alt="Royal UI Force"
              className="w-full h-full object-cover grayscale"
            />
          </div>

          {/* Team Info */}
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-gray-900 mb-2">ROYAL UI FORCE</h4>
            <p className="text-sm text-gray-500 mb-4">Founded in 2014</p>
            
            <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full text-sm font-semibold hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg">
              Follow
            </button>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">42 members</p>
              <p className="text-xs text-gray-400">
                ANIRUDDHA IS A MEMBER SINCE NOV. 2014
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}