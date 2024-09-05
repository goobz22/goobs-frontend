# goobs-frontend

goobs-frontend, previously known as goobs-repo, is a comprehensive React-based UI library built on Material-UI. It offers a wide range of customizable components for building responsive and consistent user interfaces with advanced features like form validation, theming, and code syntax highlighting.

The NPM repo is available here - https://www.npmjs.com/package/goobs-frontend

This entire repository is written in TypeScript, and there is no need for a separate types installation.

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

All components should be successfully building as of this release and are being used within production in one way or another.

This README update, along with the following documentation updates, are all part of a push to better document the usage of this project.

## Components

The following components are available within goobs-frontend. Each component has a dedicated wiki page with detailed documentation, usage examples, and best practices.

### Accordion

The Accordion component provides an expandable panel for organizing and presenting content in a collapsible manner.

[Accordion Wiki](https://github.com/goobz22/goobs-frontend/wiki/Accordion)

### Button

The Button component is a customizable button with support for icons, variants, and styling props. It provides a flexible and reusable way to create buttons in your application.

[Button Wiki](https://github.com/goobz22/goobs-frontend/wiki/Button)

### Card

The Card component offers various card layouts for displaying content, including product cards, pricing cards, and more. It supports different variants such as default, inventory, pricing summary, detailed pricing summary, product, and product summary.

[Card Wiki](https://github.com/goobz22/goobs-frontend/wiki/Card)

### CodeCopy

The CodeCopy component renders a code block with syntax highlighting and a copy-to-clipboard functionality.

[CodeCopy Wiki](https://github.com/goobz22/goobs-frontend/wiki/CodeCopy)

### ConfirmationCodeInput

The ConfirmationCodeInput component provides an input field for entering confirmation codes, often used in two-factor authentication scenarios.

[ConfirmationCodeInput Wiki](https://github.com/goobz22/goobs-frontend/wiki/ConfirmationCodeInput)

### Content

The Content component is a flexible container for rendering various types of content within your application. It supports different content types including typography, radio groups, confirmation code inputs, links, buttons, images, pricing tables, steppers, transfer lists, cards, code copy blocks, text fields, date fields, dropdowns, increment number fields, searchbars, number fields, password fields, and QR codes.

[Content Wiki](https://github.com/goobz22/goobs-frontend/wiki/Content)

### DateField

The DateField component provides a date picker input field with customizable styling options.

[DateField Wiki](https://github.com/goobz22/goobs-frontend/wiki/DateField)

### Dropdown

The Dropdown component offers a customizable select input with various styling options.

[Dropdown Wiki](https://github.com/goobz22/goobs-frontend/wiki/Dropdown)

### Grid

The Grid component is a highly customizable and flexible grid system built with React and Material-UI. It allows you to create complex grid layouts with ease, providing a wide range of configuration options for grids, rows, columns, and cells.

[Grid Wiki](https://github.com/goobz22/goobs-frontend/wiki/Grid)

### IncrementNumberField

The IncrementNumberField component provides an input field for numeric values with increment and decrement buttons.

[IncrementNumberField Wiki](https://github.com/goobz22/goobs-frontend/wiki/IncrementNumberField)

### Nav

The Nav component provides navigation functionality, including both horizontal and vertical navigation options.

[Nav Wiki](https://github.com/goobz22/goobs-frontend/wiki/Nav)

### NumberField

The NumberField component offers an input field specifically designed for numeric input with optional minimum and maximum value constraints.

[NumberField Wiki](https://github.com/goobz22/goobs-frontend/wiki/NumberField)

### PasswordField

The PasswordField component provides a secure input field for password entry with a show/hide password toggle.

[PasswordField Wiki](https://github.com/goobz22/goobs-frontend/wiki/PasswordField)

### PhoneNumberField

The PhoneNumberField component offers an input field specifically formatted for phone number entry.

[PhoneNumberField Wiki](https://github.com/goobz22/goobs-frontend/wiki/PhoneNumberField)

### PricingTable

The PricingTable component renders a customizable pricing table for displaying product or service pricing information.

[PricingTable Wiki](https://github.com/goobz22/goobs-frontend/wiki/PricingTable)

### QRCode

The QRCode component generates and displays QR codes based on the provided value.

[QRCode Wiki](https://github.com/goobz22/goobs-frontend/wiki/QRCode)

### RadioGroup

The RadioGroup component renders a group of radio buttons for selecting a single option from multiple choices.

[RadioGroup Wiki](https://github.com/goobz22/goobs-frontend/wiki/RadioGroup)

### Searchbar

The Searchbar component provides a search input field with customizable styling options.

[Searchbar Wiki](https://github.com/goobz22/goobs-frontend/wiki/Searchbar)

### Stepper

The Stepper component provides a step-by-step interface for guiding users through a process or workflow.

[Stepper Wiki](https://github.com/goobz22/goobs-frontend/wiki/Stepper)

### TextField

The TextField component offers a customizable text input field with various styling and behavior options.

[TextField Wiki](https://github.com/goobz22/goobs-frontend/wiki/TextField)

### Toolbar

The Toolbar component offers a customizable toolbar for use in various UI scenarios.

[Toolbar Wiki](https://github.com/goobz22/goobs-frontend/wiki/Toolbar)

### Tooltip

The Tooltip component is a customizable and styled version of the Material-UI Tooltip component. It provides a way to display informative text when users hover over, focus on, or tap an element.

[Tooltip Wiki](https://github.com/goobz22/goobs-frontend/wiki/Tooltip)

### TransferList

The TransferList component provides a dual-list interface for transferring items between two lists.

[TransferList Wiki](https://github.com/goobz22/goobs-frontend/wiki/TransferList)

### Typography

The Typography component is a text component for rendering customizable typography with support for different font families, variants, and colors.

[Typography Wiki](https://github.com/goobz22/goobs-frontend/wiki/Typography)

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

Please refer to the individual component and utility files for more details on their usage and available props.

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
