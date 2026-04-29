# JobPlus UI/UX Modernization TODO

## Plan Overview
Modernize the JobPlus UI without breaking core logic, backend, or existing features.

## Steps
- [x] 1. Create `frontend/src/styles/premium-polish.css` (premium design layer)
- [x] 2. Create `frontend/src/lib/use-scroll-reveal.ts` (scroll animation hook)
- [x] 3. Update `frontend/src/main.tsx` (import premium CSS)
- [x] 4. Update `frontend/src/components/system/app-frame.tsx` (attach scroll reveal)
- [x] 5. Update `frontend/src/layouts/dashboard-layout.tsx` (reveal classes & spacing)
- [x] 6. Update `frontend/src/layouts/admin-layout.tsx` (reveal classes & spacing)
- [x] 7. Update `frontend/src/styles/jobs-page-v2.css` (modernize cards/filters/preview)
- [x] 8. Update `frontend/src/styles/homepage-new.css` (modernize hero/stats/features)
- [x] 9. Update `frontend/src/components/shared/job-card.tsx` (reveal wrapper)
- [x] 10. Update `frontend/src/components/shared/company-card.tsx` (reveal wrapper)
- [x] 11. Update `frontend/src/components/shared/settings-menu.tsx` (hover polish)
- [x] 12. Update `frontend/src/components/shared/theme-toggle.tsx` (smooth transition)
- [x] 13. Build check & summary

## Bonus Fixes (pre-existing bugs)
- [x] Fixed `network-page-premium.tsx` - `followUp` vs `follow-up` key mismatch + implicit any types
- [x] Fixed `network-page-v2.tsx` - same issue
- [x] Fixed `network-page-v3.tsx` - same issue
- [x] Fixed `register-page.tsx` - `t()` function called with invalid second argument

## Build Status
✅ `npm run build` passes successfully

