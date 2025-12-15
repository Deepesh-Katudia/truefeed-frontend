'use client';

export function Biography() {
  const skills = [
    'Adobe Photoshop',
    'Adobe XD Cloud',
    'VueJS',
  ];

  return (
    <div className="space-y-6">
      {/* Biography Section */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Biography
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod 
          tempor incididunt ut labore et dolore magna aliqua. At vero eos et 
          accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren.
        </p>
      </div>

      {/* Website */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Website
        </h3>
        <a 
          href="https://truefeed.ai" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700 break-all"
        >
          https://driblab.com/@LVCKLLXS
        </a>
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white rounded-full text-xs font-semibold shadow-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-gray-100 rounded-2xl h-48 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm">Map view placeholder</p>
        </div>
      </div>
    </div>
  );
}