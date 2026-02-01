# Client Project Structure

This document describes the organization of the client-side application, explaining the purpose of each folder and providing guidelines for maintaining a clean, scalable codebase.

## Overview

The client is a React + TypeScript application built with Vite. It follows a feature-based architecture where related functionality is grouped together.

## Root Structure

```
client/
├── src/
│   ├── main.tsx                  # Application entry point
│   ├── App.tsx                   # Root component with routing
│   ├── vite-env.d.ts            # Vite type definitions
│   ├── assets/                   # Static assets (images, fonts, etc.)
│   ├── auth/                     # Authentication logic and hooks
│   ├── components/               # Shared UI components
│   ├── data/                     # Global data management (React Query)
│   ├── features/                 # Feature-based modules
│   ├── layout/                   # Layout components (navbar, etc.)
│   ├── routes/                   # Route definitions and protected routes
│   └── styles/                   # Global styles
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── vite.config.ts               # Vite configuration
└── tsconfig.json                # TypeScript configuration
```

## Folder Purposes

### `/src/assets`

Static assets like images, logos, fonts, and other media files.

- Keep assets organized by type or feature
- Use meaningful file names
- Optimize images before adding

### `/src/auth`

Authentication-related logic:

- Authentication hooks
- Auth context providers
- Token management
- Login/logout utilities

### `/src/components`

**Globally shared UI components** used across multiple features:

- Generic, reusable components (Button, Modal, ErrorBox, Loader, etc.)
- Should NOT contain feature-specific logic
- Should be well-documented with props interfaces

**When to add a component here:**

- Component is used in 2+ different features
- Component is generic and has no feature-specific dependencies
- Component represents a common UI pattern

### `/src/data`

Global data management:

- React Query configuration and setup
- Global query hooks (if not feature-specific)
- API client configuration
- Data type definitions used across multiple features

### `/src/features`

**Feature-based modules** - each feature is self-contained:

```
features/
├── dashboard/               # Dashboard feature
├── login/                   # Login feature
├── search/                  # Search feature
└── trainee-profile/         # Trainee profile feature (see detailed structure below)
```

### `/src/layout`

Layout components that define the application structure:

- Navigation bars
- Sidebars
- Page wrappers
- Footer components

### `/src/routes`

Routing configuration:

- Route definitions
- Protected route wrappers
- Route guards
- Navigation utilities

### `/src/styles`

Global styles:

- CSS reset/normalize
- Theme variables
- Global utility classes
- Typography styles

## Feature Structure

Each feature should follow this pattern:

```
feature-name/
├── [Feature].ts                 # Feature-specific type definitions (named after main type)
├── [Feature]Page.tsx            # Main page component
├── components/                  # Shared components within this feature
├── hooks/                       # Feature-specific custom hooks
├── context/                     # Feature-specific context (if needed)
├── utils/                       # Feature-specific utilities
└── [sub-features]/              # Sub-feature folders
```

### Example: Trainee Profile Feature

```
trainee-profile/
├── TraineePage.tsx               # Main entry point
├── components/                   # Shared UI components for trainee profile
│   └── MarkdownText.tsx
├── context/                      # State management for trainee profile
│   ├── TraineeProfileContext.tsx
│   └── TraineeProfileProvider.tsx
├── utils/                        # Helper functions
│   └── formHelper.ts
├── profile/                      # Main profile layout
│   ├── ProfileSidebar.tsx
│   └── components/
│       ├── TraineeProfile.tsx
│       ├── ProfileNav.tsx
│       └── EditSaveButton.tsx
├── personal-info/                # Personal information tab
│   ├── PersonalInfo.tsx
│   └── data/
│       ├── useTraineeInfoData.tsx
│       └── useSaveTraineeInfo.tsx
├── contact/                      # Contact information tab
│   └── ContactInfo.tsx
├── education/                    # Education information tab
│   └── EducationInfo.tsx
├── employment/                   # Employment information tab
│   └── EmploymentInfo.tsx
└── interactions/                 # Interactions tab
    └── InteractionsInfo.tsx
```

### Example: Cohorts Feature

```
cohorts/
├── Cohorts.ts                    # Type definitions for cohort data
├── CohortsPage.tsx               # Main page component
├── components/                   # Cohort-specific components
│   ├── CohortAccordion.tsx
│   └── TraineeAvatar.tsx
└── data/                         # Data fetching hooks
    └── useCohortsData.tsx
```

**Note:** The trainee-profile feature no longer has a root-level type file. Trainee types have been moved to `/src/data/types/Trainee.ts` as they are used across multiple features.

## Maintenance Guidelines

### Where to Put New Code

**Components:**

- Used across multiple features → `/src/components`
- Used within one feature → `/src/features/[feature-name]/components`

**Hooks:**

- Shared across features → `/src/hooks`
- Feature-specific → `/src/features/[feature-name]/hooks`
- Always use `use` prefix

**Types:**

- Shared across features → `/src/data` or relevant top-level folder
- Feature-specific → `/src/features/[feature-name]/[TypeName].ts`

**Utilities:**

- Shared across features → Create `/src/utils` if needed
- Feature-specific → `/src/features/[feature-name]/utils`

## Code Organization Principles

### 1. Feature-First Organization

Group code by feature rather than by type. This makes it easier to:

- Find related code
- Understand feature boundaries
- Remove or refactor features independently

### 2. Colocation

Keep related code close together:

- Components with their hooks and utils
- Types near where they're used
- Tests alongside implementation

### 3. Single Responsibility

Each file should have one clear purpose:

- One component per file
- One hook per file (unless very closely related)
- Focused utility functions

### 4. Clear Boundaries

Maintain clear separation between:

- **Global** (shared across features) vs **Feature-specific**
- **UI Components** vs **Business Logic**
- **Presentation** vs **Container** components

### 5. Consistent Naming

Follow these conventions:

- **Components**: PascalCase (e.g., `TraineeProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTraineeData.tsx`)
- **Utilities**: camelCase (e.g., `formHelper.ts`)
- **Type files**: PascalCase, named after the main type (e.g., `Trainee.ts`, `User.ts`)
- **Constants**: UPPER_SNAKE_CASE
