# Authorized User Layout - Design Documentation

## Table of Contents
1. [Overview](#overview)
2. [Purpose](#purpose)
3. [Target Users](#target-users)
4. [Layout Structure](#layout-structure)
5. [Component Specifications](#component-specifications)
6. [Visual Design](#visual-design)
7. [Responsive Design](#responsive-design)
8. [Interactions & Animations](#interactions--animations)
9. [Accessibility](#accessibility)
10. [Implementation Guidelines](#implementation-guidelines)
11. [Future Enhancements](#future-enhancements)

---

## Overview

The Authorized User Layout is the common structural framework used across all authenticated pages in the Trading Assist platform. This layout provides a consistent user experience and navigation system that wraps around the unique content of each authorized section (Dashboard, Rules, Analytics, Settings, etc.). The layout ensures users always have access to navigation, user controls, and platform branding regardless of which section they are currently viewing.

### Key Features
- Consistent header with branding and user controls across all authenticated pages
- Collapsible sidebar navigation providing access to all authorized user sections
- Minimal footer that doesn't interfere with content
- Flexible working area that accommodates different content types across various sections
- Responsive design that adapts to all screen sizes
- Persistent navigation state and user preferences
- Quick access to user profile and account settings

---

## Purpose

The Authorized User Layout is designed to serve as the standard page structure for authenticated users, providing a consistent and familiar interface that consolidates all personally necessary information and functionality. This layout framework addresses the need for:

- **Consistent Navigation**: Users can access any section of the platform from any authenticated page through the unified header and sidebar navigation
- **Persistent User Controls**: Quick access to profile, settings, and logout functionality is always available regardless of the current page
- **Flexible Content Area**: The working area adapts to accommodate different types of content required by various modules (Dashboard widgets, rule builder, data tables, forms, etc.)
- **Unified Experience**: Maintains consistent branding, styling, and interaction patterns across all authenticated sections
- **Efficient Navigation**: Reduces cognitive load by keeping navigation elements in predictable locations
- **Context Preservation**: Maintains user state and preferences as they navigate between different sections

The layout eliminates inconsistencies between different authenticated pages and provides users with a cohesive experience throughout their interaction with the platform.

---

## Target Users

### Primary Users

All authenticated users of the Trading Assist platform interact with this layout structure, including:

1. **Active Traders**
   - Need quick navigation between trading rules, monitoring, and analytics
   - Require persistent access to account controls and notifications
   - Value consistent interface patterns for efficiency

2. **Strategy Managers**
   - Navigate frequently between rule configuration, testing, and deployment sections
   - Need easy access to performance monitoring and analytics
   - Require quick switching between multiple sections

3. **Portfolio Analysts**
   - Access various reporting and analytics sections regularly
   - Need consistent data presentation across different modules
   - Value predictable navigation for data exploration

4. **Administrators**
   - Manage multiple sections including user management, system settings, and monitoring
   - Require quick navigation between administrative functions
   - Need consistent access controls and user management tools

5. **New Users**
   - Benefit from consistent navigation patterns that reduce learning curve
   - Can easily discover available sections through sidebar navigation
   - Find help and support consistently placed across all pages

### User Roles & Permissions

The layout adapts based on user permissions:

- **Standard Users**: Access to standard navigation items (Dashboard, Rules, Analytics, Settings)
- **Premium Users**: Additional navigation items for premium features (Advanced Analytics, Priority Support)
- **Admin Users**: Additional admin-specific navigation sections (User Management, System Settings, Logs)

---

## Layout Structure

### Full Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                        HEADER                                    │
│  [Logo]  [Menu Item 1] [Menu Item 2] ...  [User Avatar ▼] [Logout] │
├─────┬───────────────────────────────────────────────────────────┤
│     │                                                            │
│  S  │                                                            │
│  I  │                  WORKING AREA                              │
│  D  │                  (Content varies by                        │
│  E  │                   section/module)                          │
│  B  │                                                            │
│  A  │  ┌──────────────────────────────────────────────────────┐ │
│  R  │  │                                                      │ │
│     │  │   Section-Specific Content                           │ │
│  N  │  │   (Dashboard widgets, Rules builder,                 │ │
│  A  │  │    Data tables, Forms, Charts, etc.)                 │ │
│  V  │  │                                                      │ │
│     │  └──────────────────────────────────────────────────────┘ │
│     │                                                            │
│     │                                                            │
│     │                                                            │
│     │                                                            │
├─────┴───────────────────────────────────────────────────────────┤
│                        FOOTER                                    │
│         [Copyright] [Links] [Legal Information]                  │
└─────────────────────────────────────────────────────────────────┘
```

**Elements:**

1. **Logo**
   - **Position**: Left side of header
   - **Size**: 120px × 40px (desktop), 100px × 32px (mobile)
   - **Clickable**: Links to Dashboard/home page
   - **Style**: Platform logo (icon or text-based)
   - **Behavior**: Maintains branding consistency across all pages

2. **Menu Elements** (Horizontal Navigation - Optional)
   - **Position**: Left of center or immediately after logo
   - **Items**: Quick access links to commonly used sections
   - **Examples**: "Dashboard", "Rules", "Analytics", "Settings"
   - **Style**: Text links or icon buttons
   - **Spacing**: 24px between items (desktop), 16px (mobile)
   - **Active State**: Current page highlighted (underline, background, or accent color)
   - **Hover State**: Visual feedback (color change, underline)
   - **Behavior**: May be hidden on mobile in favor of sidebar navigation

3. **User Profile Avatar**
   - **Position**: Right side, before logout button
   - **Size**: 40px × 40px (circular)
   - **Display**: User's profile picture or initials in colored circle
   - **Interactive**: Click to open dropdown menu
   - **Dropdown Menu Contains**:
     - User name and email (displayed at top)
     - Profile settings link
     - Account settings link
     - Preferences/Theme toggle (light/dark mode)
     - Notification settings (if applicable)
     - Help & Support link
     - Logout option (also available as separate button)
   - **Dropdown Behavior**:
     - Opens below avatar
     - Closes on click outside or ESC key
     - Smooth animation (fade + slide)
     - Width: 240px
     - Shadow: Elevated shadow for depth

4. **Logout Button**
   - **Position**: Far right of header
   - **Style**: Icon button or text button
   - **Icon**: Exit/Logout symbol (door with arrow, power icon, etc.)
   - **Label**: "Logout" text (optional, icon-only on mobile)
   - **Behavior**: 
     - Shows confirmation dialog before logout
     - Confirmation includes: "Are you sure you want to logout?" with Cancel/Confirm buttons
   - **Mobile**: May be hidden in user menu dropdown to save space
   - **Accessibility**: Clear label and keyboard accessible

**Responsive Behavior:**
- **Desktop**: All elements visible (logo, menu items, avatar, logout)
- **Tablet**: Menu items may collapse into dropdown or hamburger menu
- **Mobile**: 
  - Logo and user avatar always visible
  - Horizontal menu items hidden (navigation via sidebar)
  - Logout may be in user dropdown menu
  - Hamburger menu button may appear to toggle sidebar

**Sticky Behavior:**
- Header remains visible when scrolling down
- Optional: Reduce height slightly when scrolled (64px → 56px)
- Add subtle shadow when scrolled to create depth
- Smooth transition animations

#### 2. Collapsible Sidebar Navigation

**Purpose:** Provides comprehensive navigation to all authorized user sections and features

**Layout (Expanded):**
```
┌─────────────┐
│   [≡] [×]   │  ← Collapse button
│             │
│  Section 1  │  ← Section header
│  • Item 1   │  ← Navigation item
│  • Item 2   │
│             │
│  Section 2  │
│  • Item 3   │
│  • Item 4   │
│             │
│  Section 3  │
│  • Item 5   │
│             │
│  ─────────  │
│             │
│  Settings   │
│  Help       │
└─────────────┘
```

**Layout (Collapsed):**
```
┌───┐
│[>]│  ← Expand button
│[ ]│  ← Icon only
│[ ]│
│[ ]│
│[ ]│
│[ ]│
│[ ]│
└───┘
```

**Navigation Structure:**

**Section 1: Trading**
- Rules Management
- Active Strategies
- Trading History
- Exchange Connections
- Order Management

**Section 2: Analytics**
- Performance Dashboard
- Strategy Analytics
- Portfolio Overview
- Reports & Exports
- Custom Reports

**Section 3: Tools**
- Strategy Builder
- Backtesting
- Market Scanner
- Alerts Manager
- API Management

**Section 4: Account** (Bottom section)
- Profile Settings
- Account Settings
- API Keys
- Billing & Subscription (if applicable)
- Preferences

**Section 5: Support**
- Documentation
- Help Center
- Contact Support
- Community Forum
- Feature Requests

**Admin Sections** (if applicable, for admin users):
- User Management
- System Settings
- Audit Logs
- Platform Analytics

**Collapse/Expand Behavior:**
- **Toggle Button**: Icon at top of sidebar (hamburger menu, chevron left/right, or collapse icon)
- **Animation**: Smooth slide transition (300ms ease-in-out)
- **State Persistence**: Remembers collapsed/expanded state per user (stored in preferences/localStorage)
- **Keyboard Shortcut**: `Ctrl+B` (Windows/Linux) or `Cmd+B` (Mac) to toggle
- **Mobile Behavior**: 
  - Sidebar hidden by default (off-canvas)
  - Accessible via hamburger menu button in header
  - Opens as overlay with backdrop
  - Closes on backdrop click or ESC key
  - Full-height overlay

**Visual States:**

- **Active Item**:
  - Highlighted background (accent color or distinct background)
  - Left accent border (3-4px width)
  - Bold or semibold text weight
  - Accent color for icon and text

- **Hover State**:
  - Light background highlight
  - Smooth transition (200ms)
  - Cursor pointer

- **Expanded State**:
  - Full text labels with icons
  - Icons positioned left of text
  - Icon size: 20px × 20px
  - Text size: 14px, regular weight

- **Collapsed State**:
  - Icons only (centered)
  - Tooltips on hover showing full label
  - Tooltip appears after 500ms hover delay
  - Tooltip positioned to the right of sidebar

- **Section Headers**:
  - Uppercase text
  - Smaller font size (11-12px)
  - Letter spacing: 0.5px
  - Muted text color
  - Spacing above: 24px
  - Spacing below: 8px

**Icon Specifications:**
- Size: 20px × 20px
- Color: Inherits from text color
- Style: Outlined or filled (consistent throughout)
- Alignment: Vertically centered with text

#### 3. Footer Component

**Purpose:** Provides minimal essential information without cluttering the interface

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  © 2024 Trading Assist  |  Privacy  |  Terms  |  Version 1.0   │
└─────────────────────────────────────────────────────────────────┘
```

#### 4. Working Area

**Purpose:** The flexible content area that displays section-specific content and adapts to different module requirements

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │   Section-Specific Content                                │  │
│  │                                                           │  │
│  │   This area varies based on the current section:         │  │
│  │   - Dashboard: Customizable widget layout                 │  │
│  │   - Rules: Rule builder interface, rule list, forms      │  │
│  │   - Analytics: Charts, tables, reports                   │  │
│  │   - Settings: Forms, preference panels                   │  │
│  │   - Tools: Tool-specific interfaces                      │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- **Position**: Below header, to the right of sidebar (or full width if sidebar collapsed)
- **Margin/Offset**: 
  - Left margin: 240px when sidebar expanded, 64px when collapsed, 0px on mobile
  - Top margin: 64px (header height)
  - Bottom margin: 48px (footer height) or sticky footer
- **Padding**: 
  - 24px (desktop)
  - 20px (tablet)
  - 16px (mobile)
- **Background**: Main content background color
- **Min Height**: Viewport height minus header and footer (calc(100vh - 64px - 48px))
- **Scroll Behavior**: 
  - Independent scrolling if content overflows
  - Smooth scroll behavior
  - Scroll position maintained per section (optional)

**Content Adaptability:**

The working area must accommodate various content types:

1. **Dashboard Module**:
   - Grid-based widget layout
   - Resizable subareas
   - Empty placeholders with add buttons

2. **Rules Module**:
   - Data tables with rules list
   - Form-based rule builder
   - Rule editor interface
   - Filter and search controls

3. **Analytics Module**:
   - Full-width charts and graphs
   - Data tables with pagination
   - Report viewers
   - Export controls

4. **Settings Module**:
   - Form layouts
   - Tabbed preference panels
   - Configuration sections
   - Save/cancel action buttons

5. **Tools Module**:
   - Tool-specific interfaces
   - Custom layouts per tool
   - Interactive components

**Layout Guidelines:**
- **Max Width**: Optional max-width constraint (e.g., 1400px) for readability on large screens, centered
- **Container**: Each section may have its own container with appropriate max-width
- **Flexibility**: Allow sections to use full width or constrained width based on content needs
- **Spacing**: Consistent padding and margins within working area
- **Background**: Distinct from header, sidebar, and footer for clear visual hierarchy

**State Management:**
- Preserve scroll position per section when navigating (optional enhancement)
- Maintain sidebar collapse state across navigation
- Remember user preferences (e.g., default sidebar state)

---



---

## Visual Design

### Color Scheme

**Active/Highlight Colors:**
- Active Navigation: Brand Primary or accent color
- Hover: Light background tint
- Focus: Focus ring in brand color

### Typography

**Font Family:**
- Primary: Inter, system-ui, -apple-system, sans-serif
- Monospace: Fira Code, Consolas, monospace (for code/data)

**Headings:**
- H1: 32px, Bold (700), line-height 1.2 - Page titles
- H2: 24px, Semibold (600), line-height 1.3 - Section titles
- H3: 20px, Semibold (600), line-height 1.4 - Subsection titles
- H4: 16px, Semibold (600), line-height 1.4 - Card/widget titles

**Body Text:**
- Large: 16px, Regular (400), line-height 1.6
- Base: 14px, Regular (400), line-height 1.5
- Small: 12px, Regular (400), line-height 1.4

**Navigation:**
- Menu Items: 14px, Medium (500)
- Sidebar Items: 14px, Regular (400)
- Section Headers: 11-12px, Semibold (600), uppercase, letter-spacing 0.5px

### Spacing System

**Padding:**
- Header: 16px horizontal
- Sidebar: 16px
- Working Area: 24px (desktop), 20px (tablet), 16px (mobile)
- Footer: 16px horizontal

**Margins:**
- Between navigation items: 24px (desktop), 16px (mobile)
- Between sidebar items: 8px vertical
- Section spacing in sidebar: 24px above section headers

**Gaps:**
- Between header elements: 16-24px
- Between footer items: 16px (with separator)

### Shadows and Elevation

**Elevation Levels:**
- Level 1: `0px 1px 3px rgba(0,0,0,0.12)` - Subtle elevation
- Level 2: `0px 4px 6px rgba(0,0,0,0.07)` - Cards, dropdowns
- Level 3: `0px 10px 15px rgba(0,0,0,0.1)` - Modals, popovers
- Level 4: `0px 20px 25px rgba(0,0,0,0.1)` - Floating elements

**Usage:**
- Header (when scrolled): Level 1 shadow
- Sidebar: Optional subtle right shadow
- Dropdown menus: Level 2 shadow
- Modals: Level 3 shadow

### Borders

**Border Width:**
- Thin: 1px (separators, borders)
- Medium: 2px (active states, focus rings)
- Thick: 3-4px (accent borders)

**Border Radius:**
- Small: 4px (buttons, inputs)
- Medium: 8px (cards, dropdowns)
- Large: 12px (modals, panels)

---

## Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 769px - 1024px
- **Desktop**: 1025px - 1440px
- **Large Desktop**: > 1440px



### Sidebar Collapse/Expand

**Animation:**
- Duration: 300ms
- Easing: `ease-in-out`
- Properties: Width transition, content fade
- Content: Text labels fade out, icons remain centered

**States:**
- Expanding: Width animates from 64px to 240px
- Collapsing: Width animates from 240px to 64px
- Content opacity: Fades in/out with 200ms delay

### Header Scroll Behavior

**Sticky Header:**
- Stays at top when scrolling
- Optional: Reduce height slightly (64px → 56px) when scrolled
- Shadow: Appears when scrolled, fades in (200ms)


### Dropdown Menus

**User Menu Dropdown:**
- Open: Fade in (200ms) + slide down (100ms)
- Close: Fade out (150ms) + slide up (100ms)
- Backdrop: Optional dimming overlay

**Sidebar Mobile Menu:**
- Open: Slide in from left (300ms) + fade in backdrop (200ms)
- Close: Slide out to left (300ms) + fade out backdrop (200ms)

### Navigation Hover States

**Menu Items:**
- Color transition: 200ms ease
- Background highlight: 200ms ease
- Underline (if applicable): 200ms ease

**Sidebar Items:**
- Background highlight: 200ms ease
- Icon/text color: 200ms ease

### Focus States

**Interactive Elements:**
- Visible focus ring: 2px solid brand color
- Focus ring offset: 2px
- Transition: 150ms ease

### Loading States

**Page Transitions:**
- Optional loading indicator during section navigation
- Smooth fade between sections (if implemented)


## Future Enhancements

### Short-term Enhancements

1. **Breadcrumb Navigation**
   - Add breadcrumb trail below header
   - Shows current section and subsection
   - Improves navigation context

2. **Search Functionality**
   - Global search in header
   - Quick access to sections and features
   - Keyboard shortcut: `Ctrl/Cmd + K`

3. **Notification System**
   - Notification bell icon in header
   - Dropdown with recent notifications
   - Badge showing unread count

4. **Theme Customization**
   - User-selectable color themes
   - Custom accent colors
   - Enhanced dark mode variants

5. **Keyboard Navigation Improvements**
   - More keyboard shortcuts
   - Quick navigation between sections
   - Command palette for power users

### Medium-term Enhancements

6. **Multi-Dashboard Support**
   - Allow multiple dashboard layouts
   - Quick switcher in header or sidebar
   - Context-aware navigation

7. **Customizable Sidebar**
   - Drag to reorder navigation items
   - Hide/show specific items
   - Create custom navigation groups

8. **Collapsible Footer**
   - Optional expanded footer with more links
   - Collapse to minimal view
   - User preference for default state

9. **Responsive Sidebar Enhancements**
   - Tablet-optimized sidebar (half-overlay)
   - Gesture-based sidebar toggle on mobile
   - Swipe gestures for navigation

10. **Accessibility Improvements**
    - Enhanced screen reader support
    - Voice navigation support
    - High contrast mode option

### Long-term Enhancements

11. **Collaborative Features**
    - Shared navigation preferences
    - Team-specific sidebar configurations
    - Collaborative session indicators

12. **AI-Powered Navigation**
    - Smart navigation suggestions
    - Predictive section loading
    - Personalized navigation order

13. **Advanced Customization**
    - Fully customizable header layout
    - Custom sidebar themes
    - Widget-based header elements

14. **Multi-Language Support**
    - Localized navigation labels
    - RTL layout support
    - Language switcher in header