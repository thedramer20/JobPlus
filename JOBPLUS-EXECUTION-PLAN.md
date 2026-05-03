# JobPlus Execution Plan
## Master Development Plan Implementation

**Version:** 1.0 | **Date:** May 2026 | **Status:** Ready for Implementation

---

# Phase 1: Foundation Fix (Critical Bugs)

## 1.1 JWT Authentication Fix
**Priority:** HIGH
**Files to Edit:**
- `src/main/java/com/jobplus/security/JwtAuthenticationFilter.java`
- `src/main/java/com/jobplus/security/JwtService.java`

**Changes:**
1. Add null/format validation before parsing JWT
2. Add guard for malformed tokens (check for exactly 3 parts)
3. Handle empty/blank tokens gracefully

**Implementation:**
```java
// In JwtAuthenticationFilter.java - add before doFilterInternal
final String authHeader = request.getHeader("Authorization");
if (authHeader == null || !authHeader.startsWith("Bearer ")) {
    filterChain.doFilter(request, response);
    return;
}
final String jwt = authHeader.substring(7);
if (jwt.isBlank() || jwt.split("\\.").length != 3) {
    filterChain.doFilter(request, response);
    return;
}
```

---

## 1.2 HikariCP Configuration Fix
**Priority:** MEDIUM
**Files to Edit:**
- `src/main/resources/application.properties`

**Changes:**
```properties
spring.datasource.hikari.keepalive-time=120000
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.maximum-pool-size=20
```

---

## 1.3 React Router Link Import Audit
**Priority:** MEDIUM
**Files to Check:**
- All page files that use `<Link>` component

**Changes:** Ensure all imports from `react-router-dom`:
```jsx
import { Link, useNavigate, useParams } from 'react-router-dom';
```

---

# Phase 2: Design System Implementation

## 2.1 CSS Design Tokens (Already Implemented ✓)
**Status:** Completed in `frontend/src/styles/design-tokens-enhanced.css`

## 2.2 Base Components Creation
**Priority:** HIGH
**Components to Create/Refactor:**
- Button variants (primary, ghost, glass)
- Card components (standard, glassmorphism)
- Input/TextField with validation states
- Badge components
- Avatar component
- Modal component

**Files Location:** `frontend/src/components/shared/`

---

# Phase 3: Page Redesign Priority Order

## Phase 3.1 - Core Auth Pages (Weeks 1-2)
1. **Sign In / Sign Up** - Multi-step wizard with validation
2. **Landing Page** - Marketing page with hero, features, social proof

## Phase 3.2 - Core Product Pages (Weeks 3-6)
1. **Jobs Page** - Most important; filters, search, job cards
2. **Job Details Page** - Full job info, apply flow, skills match
3. **Profile Page** - User profile with sections

## Phase 3.3 - Engagement Pages (Weeks 7-10)
1. **Home / Feed** - Content feed, suggested jobs
2. **Messages Page** - Real-time messaging
3. **Network Page** - Connections, suggestions

## Phase 3.4 - Business Pages (Weeks 11-14)
1. **Company Pages** - Company profiles, reviews
2. **Admin Panel** - Platform management

---

# Phase 4: Killer Features Implementation

## 4.1 AI Features (Weeks 15-20)
1. AI Job Matching
2. Culture Fit Score
3. Ghost Job Detector
4. Skills Gap Visualizer
5. Career Path Visualizer
6. AI Interview Coach
7. Salary Negotiation Simulator

---

# Implementation Checklist

## Critical Bugs (Phase 1) ✅ COMPLETED
- [x] Fix JWT MalformedJwtException - Already has guards in JwtAuthenticationFilter
- [x] Fix HikariCP thread starvation - Already configured in application.properties
- [x] Audit all React Link imports - All imports verified correct
- [x] Verify backend compiles
- [x] Verify frontend compiles

## Design System (Phase 2)
- [ ] Review existing design tokens
- [ ] Create base component library
- [ ] Implement navbar redesign
- [ ] Implement footer redesign

## Pages Priority (Phase 3)
- [ ] Landing Page
- [ ] Sign In / Sign Up
- [ ] Jobs Page
- [ ] Job Details Page
- [ ] Profile Page
- [ ] Home / Feed
- [ ] Messages
- [ ] Network
- [ ] Company Pages
- [ ] Settings
- [ ] Admin Panel

## Killer Features (Phase 4)
- [ ] AI Job Matching
- [ ] Culture Fit Score
- [ ] Ghost Job Detector
- [ ] Skills Gap Visualizer
- [ ] Career Path Visualizer

---

# Technical Stack Summary

## Current (Keep)
- Backend: Java Spring Boot
- Frontend: React + Vite + TypeScript
- Database: HikariCP (H2 in dev)
- Auth: JWT (jjwt 0.11.2)

## Recommended Additions
- State: Zustand (already in use)
- Styling: Tailwind CSS + custom CSS variables
- Animations: Framer Motion (already in use)
- Icons: Lucide React
- HTTP: Axios
- Forms: React Hook Form + Zod

---

# Team Structure for Full Build
```
1 × Tech Lead / Architect
2 × Senior Backend (Java/Spring)
3 × Senior Frontend (React/TypeScript)
1 × AI/ML Engineer
1 × DevOps / Infrastructure
1 × QA Engineer
1 × UI/UX Designer
1 × Product Manager
TOTAL: 11 people
```

---

# Estimated Timeline
- **Phase 1 (Foundation):** 2-3 weeks
- **Phase 2 (Design System):** 2-3 weeks
- **Phase 3 (Pages):** 8-10 weeks
- **Phase 4 (AI Features):** 6-8 weeks

**Total:** ~20-24 weeks with 5-7 developers

---

*This plan aligns with the JOBPLUS_MASTER_PLAN.md specifications.*
