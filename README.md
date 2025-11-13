# Tiny Suitcase - Coming Soon

A minimal "Coming Soon" landing page for Tiny Suitcase, a boutique travel agency specializing in personalized experiences for influencers.

## Tech Stack

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for automatic deployment on Vercel. Simply connect your GitHub repository to Vercel, and deployments will happen automatically on push to the main branch.

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with SEO metadata
│   ├── page.tsx        # Coming soon page component
│   └── globals.css     # Global styles with Tailwind
├── public/             # Static assets
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── next.config.js      # Next.js configuration
└── vercel.json         # Vercel deployment configuration
```

