'use client';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      {/* White outer frame */}
      <div className="w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl p-3">
        
        {/* Main card container */}
        <div className="flex flex-col lg:flex-row rounded-[1.75rem] overflow-hidden bg-white shadow-lg min-h-[680px]">
          
          {/* LEFT GRADIENT PANEL - FULLY ROUNDED */}
          <div className="lg:w-1/2 relative overflow-hidden rounded-[1.75rem]">
            {/* Multi-layer gradient background */}
            <div 
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 15% 85%, #0f172a 0%, #1e3a8a 20%, transparent 50%),
                  radial-gradient(circle at 20% 20%, #06b6d4 0%, #22d3ee 30%, transparent 60%),
                  radial-gradient(circle at 80% 80%, #a855f7 0%, #c026d3 20%, transparent 55%),
                  linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #7c3aed 100%)
                `
              }}
            />
            
            {/* Content overlay */}
            <div className="relative z-10 p-12 h-full flex flex-col justify-center text-white">
              {/* Brand logo */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mb-6">
                  <span className="text-white text-4xl font-bold">✱</span>
                </div>
                <div className="text-sm font-bold text-white/95 tracking-widest mb-2">TRUEFEED</div>
              </div>
              
              {/* Tagline */}
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                You can easily
              </h2>
              <p className="text-lg text-white/95 leading-relaxed max-w-md">
                Get access your personal hub for clarity and productivity
              </p>
            </div>
          </div>

          {/* RIGHT FORM PANEL - NO ROUNDING (flat edge) */}
          <div className="lg:w-1/2 p-8 sm:p-12 flex items-center justify-center bg-white">
            <div className="w-full max-w-md">
              
              {/* TrueFeed branding + title */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                    }}
                  >
                    <span className="text-white text-2xl font-bold">✱</span>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {title}
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {subtitle}
                </p>
              </div>

              {/* Form content */}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}