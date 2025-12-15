'use client';

export function Requests() {
  const requests = [
    {
      id: 1,
      name: 'Tyrell Barrows',
      avatar: 'https://i.pravatar.cc/100?u=tyrell',
      mutualFriends: 12,
    },
    {
      id: 2,
      name: 'Selena Gomez',
      avatar: 'https://i.pravatar.cc/100?u=selena',
      mutualFriends: 8,
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase">Requests</h3>
        <span className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
          {requests.length}
        </span>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="flex items-start gap-3">
            <img
              src={request.avatar}
              alt={request.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{request.name}</h4>
              <p className="text-xs text-gray-500 mb-3">wants to add you to friends</p>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
                  Accept
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
                  Decline
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}