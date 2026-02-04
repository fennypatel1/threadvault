# Product Requirements Document

# ThreadVault
> ThreadVault helps users reduce outfit-planning friction by providing a centralized digital view of their wardrobe.

Version: v1
Author: Fenny Patel (Product/Engineering)
Date: January 2026

## Problem Statement
People struggle to keep track of the clothes that are already in their wardrobes, which makes it difficult to remember clothing items and plan outfits. Most people rely on mental notes of what they own, or physically go through their entire wardrobe, which is rather inefficient. This lack of a central visual system leads to unworn clothing, repeated purchases of similar clothing items, and additional friction when trying to plan and share outfit options with others. 

## Target Users
### Primary Users
Students and young professionals who have an ever-changing wardrobe and regularly plan outfits, but don’t have a way to reference their wardrobe digitally. The users value organization and convenience, since they are most impacted by the friction of relying on memory, camera rolls, or ransacking their closet to decide the simple action of figuring out what to wear or sharing outfit options.
### Secondary Users:
Users who appreciate organizing and cataloging personal items, and want a way to visually track their clothing for sharing or personal outfits.
### Out of Scope Users (v1):
Users are trying to get outfit automation or fashion trend analysis. A platform that is driven by influencers. 

## Goals:
The goals of ThreadVault v1 are to:
1. Provide users with a digital catalog and visual reference to their wardrobe.
2. Reduce friction in outfit planning by removing the dependence on memory, photos, or physically searching a wardrobe.
3. Allow users to easily view their wardrobe through filters.
4. Validate demand and usability for a simplistic digital wardrobe, before expanding functionality.

## Non-Goals (v1):
The following are intentionally out of scope for v1, but will be explored in future versions:
1. Automated outfit generation or styling recommendations.
2. Fashion trend analysis or shopping suggestions
3. Social or influencer-driven discovery features
4. Advanced personalization, automation, or multi-user wardrobe management

These features were deferred to keep the initial product focused, buildable, and easy to validate.

## Core Features (v1)
### 1. Clothing Item Upload
Users can add individual clothing items to their digital wardrobe by uploading an image and assigning basic attributes such as a name and category, creating a visual record of their wardrobe.
#### User Value:
Provides the foundation for digitally cataloging clothing, eliminating dependence on memory or photos.
### 2. Custom Category Creation
Users can create and assign their own clothing categories, allowing the wardrobe to reflect how they personally organize their closet.
#### User Value:
Provides flexibility and personalization without requiring complex automation.
### 3. Wardrobe Browsing by Category
Users can view their clothing items organized by category, allowing them to quickly browse and reference what they own.
#### User Value:
Reduces friction when planning outfits by making it easy to scan relevant items without physically checking a closet.
### 4. Visual Wardrobe Overview
Users can view all uploaded clothing items in a single, consolidated interface.
#### User Value:
Gives users a clear understanding of their wardrobe, helping them better utilize existing clothing and avoid redundant purchases.
### 5. Item Count Visibility
Users can view the total number of clothing items in their wardrobe, as well as the number of items within each category.
#### User Value:
Helps users better understand their wardrobe composition and identify underused or overrepresented categories.
### 6. Edit and Delete Clothing Items
Users can edit or remove clothing items from their digital closet to keep their wardrobe accurate and up to date.
#### User Value:
Ensures the digital closet stays aligned with real-world changes, such as new purchases or donated items.

## Out of Scope Features (Post–v1)
The following features were intentionally deferred beyond v1 and will be explored in future iterations once core wardrobe cataloging and usability are validated.
### 1. Sharing & Collaboration
- Sharing individual clothing items, entire wardrobes, categories, or folder in view-only mode
- Sharing curated outfits or collections for feedback
### 2. Outfit Creation & Event-Based Planning
- Creating outfits by grouping multiple clothing items
- Event-based organization
### 3. Automation & AI-Powered Features
- Automated outfit generation or styling suggestions
- AI-based visualization of how two clothing items might look together on a person
- Weather-aware outfit recommendations
### 4. Discovery, Recommendations & Inspiration
- Recommended clothing purchases based on wardrobe gaps
- Referencing creators or influencers as sources of outfit inspiration
### 5. Social & Interactive Experiences
- Social features such as allowing friends to vote or swipe on outfit options
- Collaborative outfit decision-making experiences
### 6. Daily Tracking & Planning
- Daily outfit tracking (“daily fit check”)
- Calendar view to review past outfits and plan future outfits
- Outfit planning tied to specific dates

## Success Metrics
### Quantitative Metrics
- Item Upload Completion
    - Number of clothing items added per user
    - Percentage of users who add multiple items after initial use
- Category Usage
    - Number of custom categories created
    - Distribution of items across categories
- Engagement & Return Usage
    - Frequency of wardrobe views per user  
    - Percentage of users who return to the app after their first session
- Wardrobe Coverage
    - Ratio of uploaded items compared to a user’s perceived wardrobe size (self-reported or inferred)

### Qualitative Metrics
- User Feedback
    - Survey or direct feedback on ease of use and usefulness
    - User sentiment around reduced friction in outfit planning
- Observed Behavior
    - Willingness to continue adding items over time
    - Requests for additional features or expansions
- Pain Reduction Validation
    - User-reported reduction in time spent deciding what to wear
    - Feedback indicating improved awareness of existing wardrobe items
