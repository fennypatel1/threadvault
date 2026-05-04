# **ThreadVault**

ThreadVault is a digital closet MVP that helps users catalog, organize, and reference their wardrobe in one centralized, visual place. ThreadVault is designed to reduce outfit-planning friction by eliminating reliance on memory, camera rolls, or physically searching a closet.

https://threadvault-two.vercel.app/

## **Table of Contents**
- About the Project
- Problem
- Target Users
- Features
- Product Thinking
- Success Criteria
- Tech Stack
- Documentation
- Status
- Roadmap

## **About the Project**
ThreadVault was built as an MVP to explore whether a lightweight, visual digital closet can reduce the friction users experience when planning outfits and managing their wardrobe.
The project emphasizes intentional scope, clear tradeoffs, and validation of core user value before introducing advanced features such as automation, AI, or social functionality.

## **Problem**
People often struggle to remember what clothing they already own, making outfit planning inefficient and frustrating. Common workarounds: mental notes, camera rolls, or physically searching a closet; are fragmented and time-consuming.
This results in underutilized clothing, repeated purchases of similar items, and unnecessary friction when deciding what to wear.
ThreadVault addresses this problem by providing a simple digital system to visually catalog and manage a personal wardrobe.

## **Target Users**
- Students and young professionals with an evolving wardrobe
- Users who value organization and convenience when planning outfits
ThreadVault is currently focused on validating core wardrobe management workflows before expanding into more advanced capabilities.

## **Features**
### Core Features (v1):
- Upload clothing items with images, names, and categories
- Create custom categories to reflect personal organization styles
- Browse wardrobe items by category
- View total item counts across the wardrobe and within categories
- Edit and delete clothing items to keep the wardrobe up to date

## **Product Thinking**
ThreadVault was built as an MVP with a strong emphasis on:
- Intentional scope definition
- Clear tradeoffs between simplicity and future expansion
- Validating core user value before adding automation, AI, or social features
All product decisions, requirements, and success metrics are documented and versioned.

## **Success Criteria**
ThreadVault v1 is considered successful if users:
- Consistently add clothing items to their digital wardrobe
- Return to reference their wardrobe over time
- Report reduced friction when planning outfits

## **Tech Stack**
- Backend: FastAPI
- Database: Supabase (PostgreSQL)
- Image Storage: Cloudinary
- Frontend: 
  - Next.js (routing, app structure)
  - React (components, hooks)
  - TypeScript (typed state and props)
  - Tailwind CSS (utility-first styling)
 
## **System Design**
- Decoupled frontend and backend architecture
- RESTful API built with FastAPI for CRUD operations
- Cloud-hosted PostgreSQL database via Supabase for persistent storage
- Image uploads handled via Cloudinary for scalable media storage
- Client-side state management for responsive UI updates
 
## **Deployment**
- Frontend: Vercel
- Backend: Render
- Database: Supabase
- Media Storage: Cloudinary

## **Documentation**
Detailed product documentation is available in the /docs directory, including:
-  **Product Case Study:** [Read the Product Case Study](docs/Product-Case-Study.md)
- **Product Requirements Document (PRD):** [View PRD](docs/prd.md)
- **User Research Summary:** [View User Research](docs/User-Research-Summary.md)
- **Product Roadmap:** [View Product Roadmap](docs/Product-Roadmap.md)
- **Decisions & Tradeoffs:** [View Decisions](docs/Decisions-Log.md)
- **Risks & Mitigations:** [View Risks & Mitigations](docs/Risks-and-Mitigations.md)

## **Status**
ThreadVault is currently in v1 (MVP).

## **Roadmap**
Planned future exploration includes:
- Outfit creation and event-based planning
- Sharing and collaboration features
- AI-assisted styling and recommendations
These features were intentionally deferred to keep the initial MVP focused and easy to validate.
