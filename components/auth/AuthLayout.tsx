'use client';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#edede9_0%,#f5ebe0_52%,#d6ccc2_100%)] p-4 text-[#302c28]">
      <div className="w-full max-w-6xl rounded-[2rem] border border-[#302c28]/10 bg-[#fffaf4]/60 p-3 shadow-[0_24px_70px_rgba(48,44,40,0.13)] backdrop-blur-xl">
        <div className="grid min-h-[680px] gap-4 rounded-[1.75rem] border border-[#302c28]/10 bg-[#f5ebe0]/85 p-4 shadow-[0_16px_48px_rgba(48,44,40,0.08)] lg:grid-cols-[minmax(320px,0.95fr)_minmax(360px,0.82fr)]">
          <section className="relative flex min-h-[380px] overflow-hidden rounded-[1.35rem] border border-[#302c28]/10 bg-[linear-gradient(145deg,#d6ccc2_0%,#f5ebe0_58%,#edede9_100%)] p-8 sm:p-10">
            <div className="pointer-events-none absolute inset-5 rounded-[1.15rem] border border-[#302c28]/10" />

            <div className="relative z-10 flex h-full w-full flex-col justify-between gap-10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#302c28]/10 bg-[#fffaf4]/80 text-lg font-extrabold text-[#302c28] shadow-sm">
                  T
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#302c28]">TrueFeed</div>
                  <div className="mt-0.5 text-xs text-[#756b62]">AI-powered social clarity</div>
                </div>
              </div>

              <div className="max-w-md">
                <h2 className="text-5xl font-extrabold leading-[0.98] tracking-normal text-[#302c28] sm:text-6xl">
                  Read, post, and verify with calm focus.
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-6 text-[#756b62] sm:text-base">
                  A softer first impression for a production social app: less gradient noise,
                  more trust, and a direct path back into the feed.
                </p>
              </div>

              <div className="max-w-sm rounded-2xl border border-[#302c28]/10 bg-[#fffaf4]/70 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full border border-[#302c28]/10 bg-[#fffaf4]" />
                  <div className="min-w-0 flex-1">
                    <div className="h-2.5 w-24 rounded-full bg-[#302c28]/20" />
                    <div className="mt-2 h-2.5 w-44 rounded-full bg-[#302c28]/15" />
                  </div>
                </div>
                <div className="mt-4 h-24 rounded-2xl border border-[#302c28]/10 bg-[linear-gradient(135deg,#d6ccc2,#f5ebe0)]" />
                <div className="mt-4 h-2.5 w-2/3 rounded-full bg-[#302c28]/15" />
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center rounded-[1.35rem] border border-[#302c28]/10 bg-[#fffaf4]/75 p-6 shadow-[0_16px_48px_rgba(48,44,40,0.07)] sm:p-8">
            <div className="w-full max-w-md rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/85 p-7 shadow-[0_14px_42px_rgba(48,44,40,0.07)] sm:p-8">
              <div className="mb-7">
                <h1 className="text-3xl font-extrabold leading-tight text-[#302c28]">
                  {title}
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#756b62]">
                  {subtitle}
                </p>
              </div>

              {children}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
