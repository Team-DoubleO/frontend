# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FitFinder (spots) - A web application that recommends fitness facility programs based on user preferences and location. Built with React 19, TypeScript, Vite, and Tailwind CSS v4.

**Live URL**: https://sspots.site/

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # TypeScript check + production build (tsc -b && vite build)
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

### State Management
- **Zustand** for global state (`src/store/surveyStore.ts`)
- Survey state includes: gender, age, latitude/longitude, favorites, weekday/startTime filters
- Use `useSurveyStore()` hook to access and modify state

### API Layer
- **Axios** configured in `src/services/api.ts`
- Base URL: `https://api.sspots.site`
- Key endpoints:
  - `POST /api/v1/programs` - Fetch program list with filters (pagination via `pageSize` and `lastProgramId`)
  - `GET /api/v1/programs/:id` - Get program details

### Routing
- React Router DOM v7 in `src/routes/index.tsx`
- Routes: `/` (home), `/survey/step1-4`, `/programs`

### Styling
- Tailwind CSS v4 with Vite plugin (`@tailwindcss/vite`)
- Custom theme colors defined in `src/index.css`:
  - `--color-primary: #13EC5B`
  - `--color-dark: #1A1A1A`
- Pretendard font (Korean-optimized)

### External APIs
- **Kakao Maps API** - Location services and maps
- Types in `src/types/kakao.d.ts`
- Requires `VITE_KAKAO_APP_KEY` environment variable

## Code Organization

```
src/
├── components/     # Reusable UI (Button, Header, modals)
├── pages/          # Route pages (HomePage, ProgramListPage, survey/*)
├── routes/         # React Router configuration
├── services/       # API client and endpoints
├── store/          # Zustand stores
└── types/          # TypeScript type definitions
```

## TypeScript Configuration

- Strict mode enabled
- `noUnusedLocals` and `noUnusedParameters` enforced
- Target: ES2022, Module: ESNext
