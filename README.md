# goobs-frontend

goobs-frontend, previously known as goobs-repo, is a comprehensive React-based UI library built on Material-UI. It offers a wide range of customizable components for building responsive and consistent user interfaces with advanced features like form validation, theming, and code syntax highlighting.

The NPM repo is available here - https://www.npmjs.com/package/goobs-frontend

This entire repository is written in TypeScript, and there is no need for a separate types installation.

## Version

This is a beta release of the tools. It is available via npm to ensure functionality is as expected. We will iron out any kinks and expect version v1 to be production-ready for all components, while some components are already production-ready. Installation is confirmed working with the install instructions below.

## Integrating goobs-frontend with Next.js

This guide explains how to integrate the goobs-frontend package with a Next.js project.

**Step 1: Install the project**

In your Next.js project directory, run the following command to install goobs-frontend:

#### npm

```bash
npm i goobs-frontend
```

#### yarn

```bash
yarn add goobs-frontend
```

**Step 2: Update next.config.js**

We are using SWC; here is the minimum recommended configuration for next.config.js using our repository:

```javascript
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['goobs-frontend'],
}

export default nextConfig
```

You can see more information on how we got here and how it was incorrectly done in previous versions via - https://github.com/goobz22/goobs-frontend/discussions/21

**Step 3: Implement into project and build to confirm functionality**

All components should be successfully building as of this release and are being used within production in one way or another. The props may not all work exactly as expected, but as we go through and find a way to document each of the components further, we will determine what needs to be removed or implemented now or in future versions.

This README update, along with the following documentation updates, are all part of a push to better document the usage of this project. It is a hard requirement to move from .7-beta of this product to .8-beta as we are getting ready for release and establishing a product version release methodology.

## Components

The following components are available within goobs-frontend:

### Accordion

The Accordion component provides an expandable panel for organizing and presenting content in a collapsible manner.

### Button

The Button component is a customizable button with support for icons, variants, and styling props. It provides a flexible and reusable way to create buttons in your application.

### Card

The Card component offers various card layouts for displaying content, including product cards, pricing cards, and more. It supports different variants such as default, inventory, pricing summary, detailed pricing summary, product, and product summary.

### CodeCopy

The CodeCopy component renders a code block with syntax highlighting and a copy-to-clipboard functionality.

### ConfirmationCodeInput

The ConfirmationCodeInput component provides an input field for entering confirmation codes, often used in two-factor authentication scenarios.

### Content

The Content component is a flexible container for rendering various types of content within your application. It supports different content types including typography, radio groups, confirmation code inputs, links, buttons, images, pricing tables, steppers, transfer lists, cards, code copy blocks, text fields, date fields, dropdowns, increment number fields, searchbars, number fields, password fields, and QR codes.

### DateField

The DateField component provides a date picker input field with customizable styling options.

### Dropdown

The Dropdown component offers a customizable select input with various styling options.

### Form

The Form component includes the PopupForm subcomponent, which renders a customizable popup form.

### Grid

The Grid component is a highly customizable and flexible grid system built with React and Material-UI. It allows you to create complex grid layouts with ease, providing a wide range of configuration options for grids, rows, columns, and cells.

### IncrementNumberField

The IncrementNumberField component provides an input field for numeric values with increment and decrement buttons.

### Nav

The Nav component provides navigation functionality, including both horizontal and vertical navigation options.

### NumberField

The NumberField component offers an input field specifically designed for numeric input with optional minimum and maximum value constraints.

### PasswordField

The PasswordField component provides a secure input field for password entry with a show/hide password toggle.

### PhoneNumberField

The PhoneNumberField component offers an input field specifically formatted for phone number entry.

### PricingTable

The PricingTable component renders a customizable pricing table for displaying product or service pricing information.

### QRCode

The QRCode component generates and displays QR codes based on the provided value.

### RadioGroup

The RadioGroup component renders a group of radio buttons for selecting a single option from multiple choices.

### Searchbar

The Searchbar component provides a search input field with customizable styling options.

### Stepper

The Stepper component provides a step-by-step interface for guiding users through a process or workflow.

### TextField

The TextField component offers a customizable text input field with various styling and behavior options.

### Toolbar

The Toolbar component offers a customizable toolbar for use in various UI scenarios.

### TransferList

The TransferList component provides a dual-list interface for transferring items between two lists.

### Typography

The Typography component is a text component for rendering customizable typography with support for different font families, variants, and colors.

## Usage

To use the components, types, and utilities in your project, you can import them from the `goobs-frontend` package. Here's a comprehensive list of all available imports:

```typescript
import {
  // Components
  CustomButton,
  CustomGrid,
  Typography,
  ConfirmationCodeInput,
  RadioGroup,
  PopupForm,
  ContentSection,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CodeCopy,
  Nav,
  PricingTable,
  CustomStepper,
  CustomToolbar,
  TransferList,
  StyledTooltip,
  QRCodeComponent,
  DateField,
  Dropdown,
  IncrementNumberField,
  NumberField,
  PasswordField,
  PhoneNumberField,
  Searchbar,
  TextField,

  // Types
  CustomButtonProps,
  CustomGridProps,
  Alignment,
  BorderProp,
  columnconfig,
  gridconfig,
  cellconfig,
  FontFamily,
  TypographyVariant,
  TypographyProps,
  ConfirmationCodeInputsProps,
  RadioOption,
  RadioGroupProps,
  PopupFormProps,
  ContentSectionProps,
  CardProps,
  CodeCopyProps,
  NavProps,
  PricingProps,
  CustomStepperProps,
  ToolbarProps,
  TransferListProps,
  CustomTooltipProps,
  QRCodeProps,
  DateFieldProps,
  DropdownProps,
  IncrementNumberFieldProps,
  NumberFieldProps,
  PasswordFieldProps,
  PhoneNumberFieldProps,
  SearchbarProps,
  TextFieldProps,

  // Extended Types
  ExtendedButtonProps,
  ExtendedTypographyProps,
  ExtendedTextFieldProps,
  ExtendedQRCodeProps,
  ExtendedDropdownProps,
  ExtendedDateFieldProps,
  ExtendedNumberFieldProps,
  ExtendedIncrementNumberFieldProps,
  ExtendedPasswordFieldProps,
  ExtendedSearchbarProps,
  ExtendedCodeCopyProps,
  ExtendedCardProps,
  ExtendedTransferListProps,
  ExtendedStepperProps,
  ExtendedPricingProps,
  ExtendedImageProps,
  ExtendedConfirmationCodeInputsProps,
  ExtendedRadioGroupProps,

  // Component Props Types
  TypographyComponentProps,
  ConfirmationCodeInputProps,
  RadioGroupComponentProps,
  PopupFormComponentProps,
  ContentSectionComponentProps,
  AccordionProps,
  AccordionSummaryProps,
  AccordionDetailsProps,
  CardComponentProps,
  CodeCopyComponentProps,
  NavComponentProps,
  PricingTableComponentProps,
  CustomStepperComponentProps,
  CustomToolbarComponentProps,
  TransferListComponentProps,
  StyledTooltipComponentProps,

  // Styles
  formContainerStyle,

  // Animations
  Animation,

  // Colors
  moss,
  aqua,
  madder,
  woad,
  marine,
  pansy,
  stainlessSteel,
  coal,
  ocean,
  sky,
  salmon,
  lightning,
  sage,
  lilac,
  gunpowder,
  lightMadder,
  black,
  white,
  none,
  semiTransparentWhite,
  semiTransparentBlack,
  red,
  green,
  greyborder,

  // Typography
  arapeyh1,
  arapeyh2,
  arapeyh3,
  arapeyh4,
  arapeyh5,
  arapeyh6,
  arapeyparagraph,
  interh1,
  interh2,
  interh3,
  interh4,
  interh5,
  interh6,
  interparagraph,
  interhelperheader,
  interhelperfooter,
  merrih1,
  merrih2,
  merrih3,
  merrih4,
  merrih5,
  merrih6,
  merriparagraph,
  merrihelperfooter,
} from 'goobs-frontend'
```

Please refer to the individual component and utility files for more details on their usage and available props. We are in the process of documenting each component in the [GitHub wiki](https://github.com/goobz22/goobs-frontend/wiki).

## License

This project is licensed under the MIT License.

## Feedback and Contributions

We welcome feedback, bug reports, and contributions. If you encounter any issues or have feature requests, please open an issue on the [GitHub repository](https://github.com/goobz22/goobs-frontend/issues).

If you would like to contribute to the project, please fork the repository and submit a pull request with your changes.

If you would like to request this ported over to a different design system, a feature/capability, or more information on this project, please reach out to Matthew Goluba.

## Contact

For any questions or inquiries, please contact Matthew Goluba.

- Email - mkgoluba@technologiesunlimited.net
- LinkedIn - https://www.linkedin.com/in/matthew-goluba/

The website is in progress and will be shared here soon.

Please email for the quickest response.
