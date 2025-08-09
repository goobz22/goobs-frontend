# goobs-frontend

goobs-frontend is a comprehensive React-based UI component library featuring a custom design system with 100+ components, built with TypeScript and modern React patterns.

The NPM repo is available here - https://www.npmjs.com/package/goobs-frontend

This entire repository is written in TypeScript, and there is no need for a separate types installation.

## Storybook

See component design and documentation in Storybook available here - https://storybook.technologiesunlimited.net/

## Integrating goobs-frontend with Next.js

This guide explains how to integrate goobs-frontend with a Next.js project

**Step 1: Install the project**

In your Next.js project directory, run the following command to install goobs-frontend

#### npm

```bash
npm i goobs-frontend
```

#### yarn

```bash
yarn add goobs-frontend
```

**Step 2: Update next.config.js**

You must then transpile the package in next.config

```javascript
/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ['goobs-frontend'],
}

export default nextConfig
```

After this is done, you can import components from goobs-frontend into your project.

## Component Library Overview

goobs-frontend provides 100+ fully-featured React components organized into logical categories. All components are built with TypeScript, custom theming, and responsive design principles. For detailed documentation, examples, and interactive demos, visit our [Storybook](https://storybook.technologiesunlimited.net/).

## Core Component Categories

### 🎨 Layout & Structure

- **Grid** - Responsive grid system with flexible row/column configurations
- **Container** - Responsive content containers with consistent spacing
- **Stack** - One-dimensional layout component for arranging items
- **Paper** - Elevated surface container for content sections
- **Divider** - Visual separators for content organization

### 📝 Form Components

**Text Inputs**

- **TextField** - Versatile text input with advanced styling and label positioning
- **PasswordField** - Secure password input with show/hide toggle functionality
- **SearchField** - Search input with integrated search icons and styling
- **ComplexTextEditor** - Multi-mode editor (simple, markdown, rich text) with integrated toolbar

**Specialized Inputs**

- **PhoneNumberField** - Auto-formatting phone number input (+1-xxx-xxx-xxxx)
- **USDField** - Currency input with dollar formatting and validation
- **PercentageField** - Percentage input with % symbol and range validation
- **ConfirmationCodeInput** - OTP-style multi-digit input with auto-focus progression

**Number Inputs**

- **IncrementNumberField** - Number input with built-in increment/decrement controls
- **AccountNumberField** - Bank account number input with validation
- **RoutingNumberField** - Bank routing number input with format validation
- **CreditCardField** - Credit card input with real-time formatting
- **CVVField** - Secure CVV input for payment forms

**Date & Time**

- **DateField** - Date picker with calendar popup and keyboard navigation
- **DateRangeField** - Start/end date selection with range validation
- **TimeRangeField** - Time range selector with 12/24 hour support

**Selection Components**

- **Dropdown** - Customizable select component with advanced styling
- **MultiSelectChip** - Multi-selection dropdown with chip display
- **SearchableDropdown** - Real-time filtering dropdown with autocomplete
- **RadioGroup** - Radio button groups with custom styling and TypeScript support
- **Checkbox** - Enhanced checkbox with indeterminate state support
- **Switch** - Toggle switch with smooth animations

**IPAM & Network Fields**

- **IPAddressField** - IP address input with validation
- **CIDRField** - CIDR notation input with subnet validation
- **SubnetField** - Subnet configuration input
- **VLANField** - VLAN ID input with range validation
- **MACAddressField** - MAC address input with auto-formatting

### 🗂️ Data Display

- **DataGrid** - Advanced data table with sorting, filtering, pagination, and row management
- **Table** - Lightweight table component for simple data display
- **Card** - Versatile card container with multiple variants (product, pricing, task, inventory)
- **List** - Flexible list component with custom item rendering
- **PricingTable** - Specialized pricing comparison table with feature highlights
- **ProjectBoard** - Kanban-style board with drag-and-drop task management

### 🧭 Navigation

- **Tabs** - Horizontal tab navigation with route integration
- **Breadcrumb** - Breadcrumb navigation with custom separators
- **Stepper** - Step-by-step process indicator with customizable states
- **TreeView** - Hierarchical tree navigation with expand/collapse
- **Pagination** - Page navigation with customizable page size options

### 🎯 Action Components

- **Button** - Highly customizable button with icon support and flexible positioning
- **IconButton** - Icon-only buttons with hover states and accessibility
- **ToggleButton** - Toggle button with active/inactive states

### 💬 Feedback & Overlays

- **Alert** - Contextual alerts with multiple severity levels
- **Dialog** - Modal dialogs for complex interactions
- **Snackbar** - Toast notifications with action buttons
- **Tooltip** - Enhanced tooltips with custom positioning and styling
- **Popover** - Positioned popup containers

### 🔧 Utility Components

- **Accordion** - Collapsible content sections with smooth animations
- **Badge** - Notification badges with custom positioning
- **Chip** - Compact information chips with delete functionality
- **Avatar** - User avatars with fallback text and image support
- **ProgressBar** - Progress indicators with customizable styling
- **CodeCopy** - Syntax-highlighted code blocks with one-click copying
- **QRCode** - Dynamic QR code generator with TOTP integration
- **TransferList** - Dual-list component for moving items between collections

### 🎨 Design & Animation

- **Typography** - Text component with multiple font families (Arapey, Inter, Merriweather)
- **Fade**, **Slide**, **Zoom** - Smooth transition components for enhanced UX

### 🏗️ Advanced Components

- **Toolbar** - Flexible toolbar with multiple sections and responsive behavior
- **Content** - Dynamic content renderer supporting multiple content types
- **FormDataGrid** - Data grid with integrated form validation

### 📱 Mobile-First Design

All components are built with mobile-first responsive design principles, ensuring optimal performance across desktop, tablet, and mobile devices.

### 🎨 Comprehensive Icon Library

200+ carefully crafted icons covering:

- Navigation (arrows, chevrons, menu controls)
- Actions (add, delete, edit, save, settings)
- Communication (email, phone, notifications)
- Business (payment, store, analytics)
- Technology (code, devices, security, networking)
- Status indicators (success, error, warning, info)

## Key Features

### 🔧 Customization

- **Advanced Theming** - Override colors, fonts, spacing, and component behavior
- **Flexible Styling** - Custom CSS-in-JS with theme-aware styling system
- **Component Variants** - Multiple pre-built variants for common use cases

### 📋 Developer Experience

- **Full TypeScript Support** - Complete type definitions with IntelliSense
- **Comprehensive Documentation** - Interactive Storybook with live examples
- **Consistent API** - Predictable prop patterns across all components

### ♿ Accessibility & Performance

- **ARIA Compliance** - Full accessibility support with proper ARIA labels
- **Keyboard Navigation** - Complete keyboard support for all interactive components
- **Performance Optimized** - Lazy loading, code splitting, and optimized bundle sizes

### 🚀 Modern React Patterns

- **Hooks-Based** - Built with modern React hooks and functional components
- **State Management** - Integrated Jotai support for complex state scenarios
- **Form Integration** - Seamless integration with popular form libraries

_For complete component documentation, interactive examples, and implementation guides, visit the [Storybook documentation](https://storybook.technologiesunlimited.net/)._

### Feedback and Contributions

I welcome feedback and contributions of all kinds:

- Issues: Report bugs or request features via GitHub Issues.
- Pull Requests: Fork, create a branch, and open a PR for review.
- Custom Requests: If you need special features or want these components ported to a different design system, reach out.

### License

goobs-frontend is licensed under the MIT License.

### Contact

For questions, support, or further details, please contact Matthew Goluba

Email: mkgoluba@technologiesunlimited.net

Enjoy building with goobs-frontend!
