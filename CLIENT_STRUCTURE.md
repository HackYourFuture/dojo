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

`components/profile/` holds the pieces the profiles share:

```
components/profile/
├── ProfileTabBar.tsx         # The tabs
├── ProfileButtons.tsx        # The Edit, or Cancel and Save, and Actions buttons at the top right of the header
├── ProfileSection.tsx        # Section title, and FieldRow for a line of fields
├── ProfileValue.tsx          # A field's label and value, shown until the profile is edited
├── fieldStyles.ts            # The field width, the label above every field, and the input style that keeps it there
├── fieldChangeHandlers.ts    # The change handlers of a tab's fields, which set the field named after the input
├── ProfileTextField.tsx      # Text field, shown as a ProfileValue until the profile is edited
├── ProfileSelect.tsx         # Dropdown, with an empty option for a nullable field
├── ProfileNotes.tsx          # The Markdown notes section
├── ContactFields.tsx         # The email, phone, Slack, GitHub and LinkedIn fields of a contact tab
├── SocialLinks.tsx           # The website, Slack, GitHub and LinkedIn buttons of a profile header
├── ProfileActionsButton.tsx  # The Actions button, with a menu of the given actions
└── DeleteProfileDialog.tsx   # Asks to type the profile's name before deleting it
```

### `/src/data`

Global data management:

- React Query configuration and setup
- Global query hooks (if not feature-specific)
- API client configuration
- Data type definitions used across multiple features
- Helpers used across multiple features, like `links.ts` for links into other apps (Slack), `text.ts` and `dates.ts`

### `/src/features`

**Feature-based modules** - each feature is self-contained:

```
features/
├── admin/                   # Admin pages, like the users
├── dark-mode/               # Dark mode switch
├── dashboard/               # Dashboard feature
├── interactions/            # Interactions tab of the trainee, organisation and volunteer profiles
├── login/                   # Login feature
├── organisations/           # Organisations list, the dialog to add one, and the organisation profile
├── profile-picture/         # Picture of the trainee, organisation and volunteer profiles
├── search/                  # Search feature
├── trainee-profile/         # Trainee profile feature (see detailed structure below)
├── trainees/                # Trainees list, grouped by cohort (see below)
└── volunteers/              # Volunteers list, the dialog to add one, and the volunteer profile
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
├── context/                      # State management for trainee profile
│   ├── useTraineeProfileContext.tsx
│   └── useTraineeProfileProvider.tsx
├── utils/                        # Helper functions
│   ├── formHelper.ts             # Change handlers for the trainee's sections, and the job path label
│   └── selectOptions.ts          # The options of the trainee dropdowns, on the profile and in the create dialog
├── profile/                      # Main profile layout
│   ├── ProfileHeader.tsx
│   ├── TraineeActions.tsx        # The Actions button, with the dialog to delete the trainee
│   └── components/
│       ├── TraineeProfile.tsx    # Header, tab bar and the page padding
│       ├── ProfileDateField.tsx  # MUI date picker, can be cleared
│       └── ProfileNumberField.tsx # MUI number field (Base UI), for whole numbers
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

**Profile tabs:** the profile (`TraineeProfile`, `OrganisationProfile`, `VolunteerProfile`) owns the page padding, so the tabs have none. A tab is a stack of `ProfileSection`s from `components/profile/`; lay out fields in `FieldRow`s with `ProfileTextField`, `ProfileSelect` and the fields a single profile adds (like `ProfileDateField` for trainees and `ProfileUserPicker` for organisations), so every field gets the same width, spacing, and read-only and edit behavior. Until the profile is edited, a field is its label and value as text, not a read-only input; while editing it is a small outlined input with the label above it, in the same place. Use `<FieldRow fill>` when the fields should share the width of the row instead.

### Example: Trainees Feature

```
trainees/
├── TraineesPage.tsx              # Main page component, lists the trainees grouped by cohort
├── api/                          # API calls, response types and mappers
├── components/                   # Trainees-specific components
│   ├── ActionsCard.tsx
│   └── CohortAccordion.tsx
├── data/                         # React Query keys and hooks
│   ├── keys.ts
│   └── trainees-queries.ts
└── models/                       # Type definitions for the trainees list
    └── trainee-summary.ts
```

**Note:** The trainee-profile feature no longer has a root-level type file. Trainee types have been moved to `/src/data/types/Trainee.ts` as they are used across multiple features. Gender and pronouns are in `/src/data/types/Person.ts`, and the `SelectOption` type of the option lists of `DropdownSelect` and `ProfileSelect` is in `/src/data/types/SelectOption.ts`.

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

- Shared across features → `/src/data`, like `text.ts` and `dates.ts` (hooks go in `/src/hooks`)
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
