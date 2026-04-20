'use client';

import { FileText, User, Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  { icon: FileText, label: 'Feed', href: '/dashboard' },
  { icon: Users, label: 'People', href: '/people' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#302c28]/10 bg-[#fffaf4]/92 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_45px_rgba(48,44,40,0.12)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === '/dashboard'
              ? pathname === '/' || pathname?.startsWith('/dashboard')
              : pathname?.startsWith(item.href);

          return (
            <motion.button
              key={item.href}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => router.push(item.href)}
              className={[
                'flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-2 text-xs font-semibold transition',
                active
                  ? 'border-[#302c28]/10 bg-[#d6ccc2]/85 text-[#302c28]'
                  : 'border-transparent text-[#756b62] hover:bg-[#f5ebe0]',
              ].join(' ')}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
