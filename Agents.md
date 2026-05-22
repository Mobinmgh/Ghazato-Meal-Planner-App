# Ghazato Agent Guide

## Project context

Ghazato is a Persian RTL meal-planning PWA for Iranian users. It was originally generated in Google AI Studio and currently uses a dummy/demo-friendly system so it can be shown live before the production backend is complete.

The immediate goal is demo readiness, not production perfection.

The demo must:

- Load reliably on Vercel.
- Never get stuck forever on loading screens.
- Work even when AI, Supabase, Kavenegar, or ZarinPal credentials are missing.
- Feel like a real product to a viewer.
- Keep the code structured so production hardening can happen later without rewriting everything.

## Current stack

- Frontend: React, TypeScript, Vite
- Routing: react-router-dom
- Styling: Tailwind CSS v4
- Animation: motion/react
- Backend prototype: Express in `server.ts`
- AI prototype: Arvan/OpenAI-compatible chat endpoint through `server/gemini.ts`
- Storage prototype: localStorage plus optional Supabase persistence
- Auth prototype: phone OTP flow with Kavenegar, currently localStorage-backed after verification
- Payment prototype: ZarinPal flow, currently localStorage-backed subscription state

## Highest priority problem

The app is deployed to Vercel and gets stuck on the loading screen.

Likely cause: the app expects Express API routes such as `/api/generate-plan`, `/api/generate-shopping-list`, `/api/auth/send-otp`, and `/api/payment/request`, but Vercel does not run the custom Express server from `server.ts` as a normal long-running Node server by default.

For the demo, do not try to fully solve production deployment first. Make the frontend resilient.

## Demo readiness rules

1. No infinite loading states.
2. Every async operation must have a timeout or fallback path.
3. If an API call fails in demo mode, return deterministic mock data.
4. The app should continue even without environment variables.
5. Never expose service role keys or private API keys to the frontend.
6. Keep fake/demo behavior clearly isolated in files named with `demo`, `mock`, or `fallback`.
7. Do not mix production logic and mock logic inside large components.
8. Do not break RTL layout.
9. Keep Persian copy polished and natural.
10. Prefer small, safe changes over architectural rewrites.

## Immediate tasks

### 1. Stop Vercel loading freeze

Add deterministic mock data for:

- Weekly meal plan
- Shopping list
- OTP success path if demo mode is enabled
- Payment success path if demo mode is enabled

The meal plan fallback must match the same shape expected by `Plan.tsx`:

```ts
{
  daily_calorie_target: number,
  summary: string,
  days: [
    {
      day: string,
      total_calories: number,
      meals: {
        breakfast: Meal,
        lunch: Meal,
        dinner: Meal,
        snack: Meal
      }
    }
  ]
}