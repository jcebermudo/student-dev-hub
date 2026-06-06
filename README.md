# Fuse App

- download the github cli if u havent yet: https://cli.github.com/
- clone the repo
- make sure you have nodejs installed (hopefully v20 and above): https://nodejs.org/en
- download the env file i gave you
- make a `.env.local` file in the root directory
- paste the content from the env file sa messenger
- install the dependencies with `npm install`
- run it locally `npm run dev`

For the DB and Auth, we will be using Firebase and deploy to vercel

For doing backend in nextjs, u can read dis:
- https://nextjs.org/docs/app/getting-started/fetching-data#with-the-fetch-api
- https://nextjs.org/docs/app/getting-started/mutating-data
then use it with the Firestore (Firebase nosql db)

Structure:
```
student-dev-hub/
  │
  ├── app/                                    # Next.js App Router root
  │   ├── (protected)/                        # Route group — requires auth, shares sidebar layout
  │   │   ├── layout.tsx                      # Auth guard + SidebarLayout for all protected routes
  │   │   ├── hackathons/page.tsx             # Hackathons listing page
  │   │   ├── jobs/page.tsx                   # Jobs/Match swipe page
  │   │   └── profile/page.tsx               # User profile page
  │   ├── login/page.tsx                      # Public login page with Google OAuth
  │   ├── page.tsx                            # Root — redirects to /profile
  │   ├── layout.tsx                          # Root layout — wraps app with AuthProvider
  │   ├── globals.css                         # Global Tailwind styles
  │   └── favicon.ico                         # App favicon
  │
  ├── components/
  │   ├── app-sidebar.tsx                     # Sidebar nav with logo, links, and logout button
  │   ├── sidebar-layout.tsx                  # Wraps pages in SidebarProvider + SidebarInset
  │   └── ui/                                 # shadcn/ui primitives
  │       ├── avatar.tsx                      # Avatar component
  │       ├── badge.tsx                       # Badge/tag component
  │       ├── button.tsx                      # Button component
  │       ├── card.tsx                        # Card component
  │       ├── input.tsx                       # Input field component
  │       ├── separator.tsx                   # Horizontal divider
  │       ├── sheet.tsx                       # Slide-over panel component
  │       ├── sidebar.tsx                     # Full sidebar primitive (collapsible)
  │       ├── skeleton.tsx                    # Loading skeleton component
  │       └── tooltip.tsx                     # Tooltip component
  │
  ├── contexts/
  │   └── auth-context.tsx                    # Firebase auth state — user, loading, signIn, signOut
  │
  ├── hooks/
  │   └── use-mobile.ts                       # Hook to detect mobile viewport
  │
  ├── lib/
  │   ├── firebase.ts                         # Firebase app initialization
  │   ├── auth.ts                             # Firebase auth instance + GoogleAuthProvider
  │   └── utils.ts                            # cn() utility for merging Tailwind classes
  │
  ├── public/                                 # Static assets served as-is
  │   ├── images/                             # App images (logos, banners, avatars)
  │   │   ├── companies/                      # Company logos for job cards
  │   │   └── people/                         # Profile photos
  │   └── *.svg                               # Default Next.js placeholder SVGs
  │
  ├── .env.local                              # Firebase env vars (not committed)
  ├── .gitignore                              # Git ignore rules
  ├── components.json                         # shadcn/ui config
  ├── eslint.config.mjs                       # ESLint config
  ├── next.config.ts                          # Next.js config
  ├── next-env.d.ts                           # Next.js TypeScript declarations (auto-generated)
  ├── package.json                            # Dependencies and scripts
  ├── package-lock.json                       # Locked dependency tree
  ├── postcss.config.mjs                      # PostCSS config for Tailwind
  ├── tsconfig.json                           # TypeScript config
  ├── CLAUDE.md                               # Claude Code instructions
  └── AGENTS.md                               # Agent-specific instructions
```

Useful resources:
- Firebase docs: https://firebase.google.com/docs
- Nextjs docs: https://nextjs.org/docs
- Tailwind (for our styling framework): https://tailwindcss.com/docs/
- Shadcn (component library): https://ui.shadcn.com/docs
- Motion.dev (animation library): https://motion.dev/docs

u guys can just feed the docs and enable web search to ur AI para madali :)