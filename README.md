# TrueFeed Frontend

Next.js frontend for the TrueFeed project. Built with the Next.js App Router and Tailwind CSS.

Quick start

1. Install dependencies:

   npm install

2. Start development server:

   npm run dev

Available scripts

- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run start` — run the production build
- `npm run lint` — run ESLint

Configuration

- Environment variables may be defined in `.env.local`. Typical values:
  - `NEXT_PUBLIC_API_URL` — base URL for the backend API

Project structure (recommended)

```
src/
├── app/          # App router pages & layouts
├── components/   # Reusable components
│   ├── modules/  # Complex, stateful components
│   └── ui/       # Atomic UI components
├── lib/          # Client helpers and API logic
├── api/          # Functions that call backend endpoints
├── hooks/        # Custom React hooks
├── styles/       # Tailwind and global CSS
└── public/       # Static assets
```

Notes

- This project targets Next.js 13+ App Router. Adjust the layout and routing conventions if you use a different Next.js version.
  This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
