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
│   ├── hooks/                    # Hooks shared across features
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

- Generic, reusable components (Button, Modal, ErrorBox, Loader, ListItemActions, etc.)
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
- Helpers used across multiple features, like `links.ts` for links into other apps (Slack)

### `/src/features`

**Feature-based modules** - each feature is self-contained:

```
features/
├── dashboard/               # Dashboard feature
├── interactions/            # Interactions tab of the trainee and organisation profiles
├── login/                   # Login feature
├── profile-picture/         # Picture of the trainee and organisation profiles
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
├── api/                          # API calls, response types and mappers
├── data/                         # React Query keys, queries and mutations
├── components/                   # Shared UI components for trainee profile
│   └── MarkdownText.tsx
├── context/                      # State management for trainee profile
│   ├── useTraineeProfileContext.tsx
│   └── useTraineeProfileProvider.tsx
├── utils/                        # Helper functions
│   ├── dateHelper.ts
│   ├── formHelper.ts             # Change handlers for the profile fields
│   └── selectOptions.ts          # The options of every dropdown in the profile and the create dialog
├── profile/                      # Main profile layout
│   ├── ProfileHeader.tsx
│   └── components/
│       ├── TraineeProfile.tsx    # Header, tab bar and the page padding
│       ├── ProfileNav.tsx
│       ├── EditSaveButton.tsx
│       ├── ProfileSection.tsx    # Section title, and FieldRow for a line of fields
│       ├── ProfileValue.tsx      # A field's label and value, shown until the profile is edited
│       ├── fieldStyles.ts        # The field width, the label above every field, and the input style that keeps it there
│       ├── ProfileTextField.tsx  # Text field, shown as a ProfileValue until the profile is edited
│       ├── ProfileDateField.tsx  # MUI date picker, can be cleared
│       ├── ProfileNumberField.tsx # MUI number field (Base UI), for whole numbers
│       ├── ProfileSelect.tsx     # Dropdown, with "- Not set -" for a nullable field
│       ├── ProfileMultiSelect.tsx # Autocomplete for several values, shown as their labels until the profile is edited
│       ├── ProfileUserPicker.tsx # Autocomplete for users, with their avatars, picked from the active users
│       └── DropdownSelect.tsx    # The dropdowns of the dialogs that add a trainee or an organisation
├── personal-info/                # Personal information tab
│   └── PersonalInfo.tsx
├── contact/                      # Contact information tab
│   └── ContactInfo.tsx
├── education/                    # Education information tab, with the assessments
│   └── EducationInfo.tsx
├── employment/                   # Employment information tab, with the employment history
│   └── EmploymentInfo.tsx
└── create/                       # Dialog to add a trainee
```

**Profile tabs:** `TraineeProfile` owns the page padding, so the tabs have none. A tab is a stack of `ProfileSection`s; lay out fields in `FieldRow`s with `ProfileTextField`, `ProfileDateField`, `ProfileNumberField`, `ProfileSelect`, `ProfileMultiSelect` and `ProfileUserPicker`, so every field gets the same width, spacing, and read-only and edit behavior. Until the profile is edited, a field is its label and value as text, not a read-only input; while editing it is a small outlined input with the label above it, in the same place. Use `<FieldRow fill>` when the fields should share the width of the row instead.

### Example: Trainees Feature

```
trainees/
├── TraineesPage.tsx              # Main page component, lists the trainees grouped by cohort
├── api/                          # API calls, response types and mappers
├── components/                   # Trainees-specific components
│   ├── CohortAccordion.tsx
│   └── TraineeAvatar.tsx
├── data/                         # React Query keys and hooks
│   ├── keys.ts
│   └── trainees-queries.ts
└── models/                       # Type definitions for the trainees list
    └── trainee-summary.ts
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
