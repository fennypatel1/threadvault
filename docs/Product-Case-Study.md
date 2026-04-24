# Product Case Study

# ThreadVault

## Overview
**ThreadVault** is a digital wardrobe management app that reduces outfit-planning friction by giving users a centralized, visual view of their clothing. The product helps users remember what they own, better utilize existing items, and avoid redundant purchases.

This case study highlights the problem discovery, user research, MVP decisions, and product strategy behind ThreadVault v1.

## Problem
Outfit planning is often more difficult than it needs to be. Most people rely on memory, camera rolls, or physically searching their closet to remember what clothing they own. This creates unnecessary friction, leads to underused items, and results in repeated purchases of similar clothing.

There is no lightweight, visual system that allows users to quickly reference their wardrobe without introducing complexity or automation overhead.

## Users
### Primary users:
Students and young professionals who plan outfits frequently and manage their wardrobes independently.
### Secondary users:
Individuals who enjoy organizing personal items and want a visual catalog of their clothing.
### Out of scope (v1):
Users seeking automated styling, fashion trend analysis, or influencer-driven experiences.

## Research & Insights

I conducted an early-stage user survey with 17 respondents to understand current wardrobe habits and pain points.

**Key insights:**
- Most users rely on memory or physical organization to track clothing.
- Outfit decision-making is a frequent, recurring pain point.
- Visual reference is the most helpful aid when choosing outfits.
- Redundant clothing purchases are common due to low wardrobe awareness.
- Users are interested in a digital closet but are concerned about setup effort and privacy.

These findings validated the need for a visual, centralized wardrobe system and informed a deliberately scoped MVP.

## Solution (v1)
ThreadVault v1 focuses on foundational wardrobe visibility rather than automation.

**Core features:**
- Upload, edit, and delete clothing items
- User-defined categories
- Category-based browsing
- Visual wardrobe overview
- Item counts by category and overall wardrobe

The MVP is intentionally lightweight to reduce onboarding friction and support gradual adoption over time.

## System Architecture:
<img width="1227" height="733" alt="Screenshot 2026-04-24 at 11 46 06 AM" src="https://github.com/user-attachments/assets/57a69df4-0d43-4f64-871e-ca8c732c7f58" />
ThreadVault uses a modern, decoupled architecture:
- Frontend (Next.js + React): Handles UI, state management, and user interactions
- Backend (FastAPI): Provides RESTful APIs for CRUD operations
- Database (Supabase / PostgreSQL): Stores structured wardrobe data
- Media Storage (Cloudinary): Handles image uploads and delivery

**Data Flow:**
- User uploads clothing item
- Image is stored in Cloudinary
- Metadata (name, category, image URL) is stored in Supabase
- Frontend fetches and renders items via FastAPI APIs
This architecture enables scalability, separation of concerns, and real-world deployment patterns.

## Key Product Decisions
- Prioritized wardrobe cataloging first to address the core issue of forgetting owned items.
- Deferred AI and automation until sufficient wardrobe data exists.
- Allowed custom categories to support diverse organization styles.
- Excluded social and influencer features in v1 to focus on individual user value.
- Deferred Outfit of the Day tracking until return usage is validated.

Each decision balanced user value, complexity, and validation speed.

## Roadmap
- **Phase 1 (v1):** Core wardrobe cataloging and visibility
- **Phase 2:** Outfit creation, event-based planning, and lightweight sharing
- **Phase 3:** AI-assisted outfit suggestions, weather awareness, and social collaboration

Features are sequenced based on data readiness and user engagement rather than novelty.

## Risks & Mitigations
- Onboarding friction: Support incremental uploads with minimal required fields
- Incomplete wardrobes: Ensure partial wardrobes still provide value
- Privacy concerns: Default wardrobes to private and avoid social sharing in v1
- Low return usage: Emphasize everyday browsing and visual awareness

## Metrics & Evaluation
To evaluate whether ThreadVault successfully reduces outfit-planning friction, the following metrics are tracked:

**Adoption Metrics:**
- Number of items added per user
- % of users who upload at least 5 items (initial activation threshold)
  
**Engagement Metrics:**
- Weekly active users (WAU)
- Average sessions per user per week
- Frequency of wardrobe browsing (view events)
  
**Retention Signals:**
- % of users returning after initial setup
- Time between sessions
  
**Qualitative Metrics:**
- Self-reported reduction in outfit planning time
- User feedback on ease of finding outfits
- Perceived usefulness of visual wardrobe organization
  
**Success Criteria (v1 targets):**
- Users upload ≥5 items within first session
- Users return at least once within a week
- Users report reduced friction in outfit planning

## Outcome & Learnings
Early validation showed strong interest in a visual wardrobe system that reduces cognitive load during outfit planning. This project reinforced the importance of sequencing features based on user readiness and avoiding premature complexity.

ThreadVault v1 establishes a solid foundation for future planning, automation, and collaboration features.
