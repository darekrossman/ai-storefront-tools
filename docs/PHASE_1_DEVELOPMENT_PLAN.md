# Phase 1 Development Plan - Basic Pages & Navigation

## 📊 Current State Analysis

**✅ Already Implemented:**
- Supabase authentication with middleware
- Login/signup pages and actions  
- Project CRUD server actions (`actions/projects.ts`)
- Account management page (`/account`)
- PandaCSS styling system with pattern components
- Basic app structure with Next.js 15 App Router
- Homepage simplified to hello world message

**🔄 Needs Implementation:**
- Navigation system for guest and authenticated users
- Dashboard for project management
- Project management UI components
- Authentication flow improvements
- User experience polish

## 🎯 Phase 1 Development Steps

### **Step 1: Create Navigation System**
- [x] **Create Guest Header Component** (`components/navigation/guest-header.tsx`)
  - Simple header with app name/logo
  - Login and Sign Up buttons linking to `/login`
  - Mobile-responsive design using PandaCSS patterns

- [x] **Create Dashboard Navigation Component** (`components/navigation/dashboard-nav.tsx`)
  - Navigation bar for authenticated users
  - Links to Dashboard, Account
  - Logout button functionality
  - User indicator (email or name)

### **Step 2: Update Homepage for Guest Users**
- [ ] **Enhance Current Homepage** (`app/page.tsx`)
  - Keep simple hello world but add guest header
  - Add basic product description
  - Include call-to-action to sign up/login
  - Redirect logic: authenticated users → `/dashboard`

### **Step 3: Create Dashboard Page**
- [x] **Main Dashboard Route** (`app/dashboard/page.tsx`)
  - Welcome message for authenticated users
  - Projects list using existing `getProjectsAction`
  - "Create New Project" button
  - Dashboard navigation component

- [x] **Dashboard Layout** (`app/dashboard/layout.tsx`)
  - Include dashboard navigation
  - Consistent layout for all dashboard pages
  - Authentication requirement enforcement

### **Step 4: Build Project Management UI**
- [x] **Project List Component** (`components/projects/project-list.tsx`)
  - Grid/list display of user's projects
  - Project cards showing name, description, created date
  - Empty state when no projects exist

- [x] **Project Card Component** (`components/projects/project-card.tsx`)
  - Individual project display
  - Basic project info
  - Edit and delete action buttons
  - Click to view project details

- [x] **Create Project Form** (`components/projects/create-project-form.tsx`)
  - Form for new project creation
  - Name and description fields
  - Uses existing `createProjectAction`
  - Success/error handling

### **Step 5: Create Project CRUD Pages**
- [x] **New Project Page** (`app/dashboard/projects/new/page.tsx`)
  - Simple page with create project form
  - Redirect to dashboard on success

- [x] **Project Details Page** (`app/dashboard/projects/[id]/page.tsx`)
  - Display individual project information
  - Edit and delete buttons
  - Uses existing `getProjectAction`

- [x] **Edit Project Page** (`app/dashboard/projects/[id]/edit/page.tsx`)
  - Edit form for existing projects
  - Pre-populated with current data
  - Uses existing `updateProjectAction`

<!-- ### **Step 6: Create Reusable UI Components**
- [ ] **Button Component** (`components/ui/button.tsx`)
  - Styled using PandaCSS patterns
  - Primary, secondary, and danger variants
  - Loading state support

- [ ] **Form Field Component** (`components/ui/form-field.tsx`)
  - Consistent form input styling
  - Label, input, and error message handling
  - Integration with form validation

- [ ] **Modal Component** (`components/ui/modal.tsx`)
  - For delete confirmations
  - Overlay and basic modal structure
  - Close functionality -->

### **Step 7: Update Authentication Flow**
- [ ] **Modify Login Actions** (`app/login/actions.ts`)
  - Change successful login redirect from `/` to `/dashboard`
  - Improve error handling and user feedback

- [ ] **Update Middleware** (`middleware.ts`)
  - Allow guest access to homepage (`/`)
  - Ensure dashboard routes require authentication
  - Proper redirect handling

- [ ] **Improve Login Page** (`app/login/page.tsx`)
  - Better styling using PandaCSS
  - Clear separation of login vs signup
  - Link back to homepage

### **Step 8: Polish and Testing**
- [ ] **Consistent Styling**
  - Apply PandaCSS patterns throughout
  - Use design tokens for spacing, colors, typography
  - Ensure mobile responsiveness

- [ ] **Loading States**
  - Add loading indicators for async operations
  - Skeleton states for project lists
  - Button loading states

- [ ] **Error Handling**
  - User-friendly error messages
  - Graceful handling of failed operations
  - Toast notifications or inline errors

- [ ] **User Feedback**
  - Success messages for CRUD operations
  - Confirmation dialogs for destructive actions
  - Clear navigation and breadcrumbs

## 📁 Proposed File Structure

```
app/
├── page.tsx                           # ✅ Guest landing (already simplified)
├── dashboard/
│   ├── layout.tsx                     # Dashboard layout with nav
│   ├── page.tsx                       # Main dashboard
│   └── projects/
│       ├── new/
│       │   └── page.tsx              # Create project
│       └── [id]/
│           ├── page.tsx              # Project details
│           └── edit/
│               └── page.tsx          # Edit project
components/
├── navigation/
│   ├── guest-header.tsx              # Header for non-auth users
│   └── dashboard-nav.tsx             # Navigation for auth users
├── projects/
│   ├── project-card.tsx              # Individual project card
│   ├── project-list.tsx              # Projects grid/list
│   └── create-project-form.tsx       # Project creation form
└── ui/
    ├── button.tsx                    # Reusable button
    ├── modal.tsx                     # Modal component
    └── form-field.tsx                # Form input component
```

## 🔄 User Flow Definitions

### **Guest User Flow:**
1. **Homepage** (`/`) → See hello world + product intro + login/signup buttons
2. **Click Login** → `/login` → Authenticate → Redirect to `/dashboard`
3. **Click Signup** → `/login` (signup mode) → Register → Redirect to `/dashboard`

### **Authenticated User Flow:**
1. **Any Page** → Middleware validates auth → Access granted
2. **Homepage** (`/`) → Auto-redirect to `/dashboard`
3. **Dashboard** → View projects list → Create/Edit/Delete projects
4. **Navigation** → Available on all authenticated pages (Dashboard, Account, Logout)

## 🎨 Design Guidelines

### **Styling Strategy:**
- **Primary**: Use PandaCSS pattern components (`Box`, `Stack`, `Flex`, `HStack`, `VStack`)
- **Secondary**: Use `styled` from `@/styled-system/jsx` for custom components
- **Tokens**: Leverage design tokens from `styled-system/tokens/`
- **Responsive**: Mobile-first responsive design
- **Minimal**: Clean, functional design focusing on usability

### **Component Patterns:**
- **Server Components**: Default choice for better performance
- **Client Components**: Only when needed (forms, interactive elements)
- **Composition**: Small, focused, reusable components
- **Actions**: Use existing server actions from `actions/` directory

## ⚠️ Scope Constraints

**What's INCLUDED in Phase 1:**
- ✅ Basic authentication flows
- ✅ Project CRUD operations
- ✅ Simple navigation system
- ✅ Minimal but functional UI
- ✅ Mobile-responsive design

**What's EXCLUDED from Phase 1:**
- ❌ Complex modals or overlays
- ❌ Advanced filtering or search
- ❌ Brand or catalog management
- ❌ Complex state management
- ❌ Advanced styling or animations
- ❌ Multiple project types or templates

## 🚀 Success Criteria

- [ ] **Guest Access**: Non-authenticated users can view homepage
- [ ] **Authentication**: Users can register, login, and logout successfully  
- [ ] **Auto-Redirect**: Authenticated users accessing `/` go to `/dashboard`
- [ ] **Project Management**: Full CRUD operations for projects work correctly
- [ ] **Navigation**: Consistent navigation across all authenticated pages
- [ ] **Responsive Design**: Works well on mobile and desktop
- [ ] **Error Handling**: Graceful handling of common error scenarios
- [ ] **Performance**: Fast loading times with proper caching

## 📝 Implementation Notes

### **Database Usage:**
- Leverage existing `actions/projects.ts` server actions
- Use auto-generated types from `lib/supabase/database-types.ts`
- Follow existing RLS security patterns

### **Styling Approach:**
- Start with pattern components: `Box`, `Stack`, `Flex`, etc.
- Use design tokens for consistent spacing and colors
- Reference `styled-system/` directory for available utilities
- Keep styling minimal but professional

### **Authentication Integration:**
- Middleware already handles route protection
- Session management already implemented
- Build upon existing login/logout infrastructure

### **Next Steps After Phase 1:**
- Add brand management within projects
- Implement product catalog features
- Add AI agent integration
- Enhanced UI/UX improvements
- Export functionality