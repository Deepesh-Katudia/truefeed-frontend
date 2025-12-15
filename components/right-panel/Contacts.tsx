'use client';

export function Contacts() {
  const contacts = [
    { id: 1, name: 'Amanda Miles', avatar: 'https://i.pravatar.cc/100?u=amanda', online: true },
    { id: 2, name: 'Melissa Byron', avatar: 'https://i.pravatar.cc/100?u=melissa', online: false },
    { id: 3, name: 'Ronald Bezos', avatar: 'https://i.pravatar.cc/100?u=ronald', online: false },
    { id: 4, name: 'Billy Rosewood', avatar: 'https://i.pravatar.cc/100?u=billy', online: true },
    { id: 5, name: 'Katty Monroe', avatar: 'https://i.pravatar.cc/100?u=katty', online: false },
    { id: 6, name: 'Kurt Williamson', avatar: 'https://i.pravatar.cc/100?u=kurt', online: true },
    { id: 7, name: 'Sarah Whitman', avatar: 'https://i.pravatar.cc/100?u=sarah', online: false },
    { id: 8, name: 'Alena Vinkova', avatar: 'https://i.pravatar.cc/100?u=alena', online: false },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase">Contacts</h3>
        <span className="text-xs text-gray-400">{contacts.length}</span>
      </div>

      <div className="space-y-3">
        {contacts.map((contact) => (
          <div key={contact.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-10 h-10 rounded-full"
                />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    contact.online ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
              </div>
              <span className="text-sm font-medium text-gray-900">{contact.name}</span>
            </div>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}