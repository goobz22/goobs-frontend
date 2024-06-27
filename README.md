# goobs-repo

goobs-repo is a collection of reusable components and utilities for building web applications with React and Next.js. It provides a set of tools to streamline development and enhance functionality.

The NPM repo is available here - https://www.npmjs.com/package/goobs-repo

This entire repository is written in typescript and there is no need for a types/ install file

## Version

Current version: 0.7.49 (beta)

This is a beta release of the tools. It is available via npm to ensure functionality is as expected. We will iron out any kinks and expect version v1 to be production-ready for all components, while some components are already production-ready. Installation confirmed working with install instructions below.

## Integrating goobs-repo with Next.js

This guide explains how to integrate the goobs-repo package with a Next.js project

**Step 1: Install the project**

In your Next.js project directory, run the following command to install goobs-repo

#### npm

```bash
npm i goobs-repo
```

#### yarn

```bash
yarn add goobs-repo
```

**Step 2: Update next.config.js**

We are using SWC; here is the minimum recommended configuration for next.config.js using our repository

```bash
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
```

which you can see more information on how we got here and how it was incorrectly done in previous versions via - https://github.com/goobz22/goobs-repo/discussions/21

**Step 3: Implement into project and build to confirm functionality**

All components should be successfully building as of this release and are being used within production in one way or another. The props may not all work exactly as expected but as I go through and find a way to document each of the components further I will sus out what needs removed and or implemented now or in future versions.

This readme update along side the following documentation updates are all a push to better document the usage of this project and is a hard requirement to move from .7-beta of this product and to move onto .8-beta as I am getting ready for release and establishing a product version release methodology.

## Components

The following components are within goobs-repo

### Button

The Button component is a customizable button with support for icons, variants, and styling props. It provides a flexible and reusable way to create buttons in your application.

#### Capabilities Preview

- text (optional): The text to display on the button.
- variant (optional): The variant of the button (e.g., 'contained', 'outlined', 'text').
- fontsize (optional): The font size of the button text.
- icon (optional): The icon to display on the button.
- iconlocation (optional): The location of the icon ('left' or 'right').
- type (optional): The type of the button (e.g., 'button', 'submit', 'reset').
- onClick (optional): The function to be called when the button is clicked.
- fontcolor (optional): The color of the button text.
- helperfooter (optional): An object containing helper footer properties (status, statusMessage).

The usage of the button component and these props will be documented before release of v.8. within this wiki - https://github.com/goobz22/goobs-repo/wiki/Button

### Grid

The Grid component is a highly customizable and flexible grid system built with React and Material-UI. It allows you to create complex grid layouts with ease, providing a wide range of configuration options for grids, rows, columns, and cells.

#### Capabilities Preview

- gridconfig: An object or an array of objects representing the grid configuration. It includes properties such as grid name, margins, width, and animation.
- columnconfig: An array of objects representing the column configuration. Each object includes properties such as the row and column position, grid name, alignment, column width, margins, animation, and custom component.
- cellconfig (optional): An object representing the cell configuration. It includes properties such as border style and minimum height.

The usage of the grid component and these props will be documented before release of v.8. within this wiki - https://github.com/goobz22/goobs-repo/wiki/Grid

### Typography

The Typography component is a text component for rendering customizable typography.

#### Capabilities Preview

- text (optional): The text content to be rendered.
- fontvariant (optional): The variant of the typography component.
- fontcolor (optional): The color of the typography text.
- columnconfig (optional): The configuration object for the grid column.
- cellconfig (optional): The configuration object for the grid cell.

The usage of the typography component and these props will be documented before release of v.8. within this wiki - https://github.com/goobz22/goobs-repo/wiki/Typography

### StyledComponent

The StyledComponent is a versatile and customizable input component built with React and Material-UI. It provides a range of input variants and supports various styling options to match your application's design requirements.

#### Capabilities Preview

- name (optional): The name of the input field.
- outlinecolor (optional): The color of the input outline.
- iconcolor (optional): The color of the input icons.
- backgroundcolor (optional): The background color of the input.
- combinedfontcolor (optional): The color of the input text and label when combined.
- unshrunkfontcolor (optional): The color of the label when not shrunk.
- shrunkfontcolor (optional): The color of the label when shrunk.
- endAdornmentMarginRight (optional): The right margin of the end adornment.
- autoComplete (optional): The autocomplete attribute for the input.
- componentvariant (optional): The variant of the input component (e.g., 'textfield', 'phonenumber', 'password', 'dropdown', 'searchbar').
- options (optional): An array of options for the dropdown variant.
- helperfooter (optional): An object containing helper footer properties (status, statusMessage).
- placeholder (optional): The placeholder text for the input.
- minRows (optional): The minimum number of rows for the multiline textfield variant.
- formname (optional): The name of the form associated with the input.
- label (optional): The label text for the input.
- shrunklabellocation (optional): The location of the shrunk label ('onnotch', 'above', 'left').
- value (optional): The value of the input.
- onChange (optional): The function to be called when the input value changes.
- defaultValue (optional): The default value of the input.
- inputRef (optional): The ref object for the input element.
- columnconfig (optional): The configuration object for the grid column.
- serverActionValidation (optional): An async function that performs server-side validation on the input value.

#### Hooks

The StyledComponent utilizes several custom hooks to enhance its functionality:

- src/hooks/styledcomponent/useDropdown.tsx: Handles the dropdown functionality, including opening/closing the dropdown, filtering options, and selecting an option.
- src/hooks/styledcomponent/usePhoneNumber.tsx: Handles phone number formatting and updating the input value.
- src/hooks/styledcomponent/usePassword.tsx: Handles password visibility toggling.
- src/hooks/styledcomponent/useSearchbar.tsx: Handles the searchbar functionality, including filtering options based on the search query.

#### Validation

The StyledComponent supports both client-side and server-side validation. Client-side validation is handled by the component itself, while server-side validation is performed through the serverActionValidation prop.

When the serverActionValidation prop is provided, the component debounces the validation function to optimize performance. The validation result is then displayed in the helper footer message.

The usage of the StyledComponent component and these props will be documented before release of v.8. within this wiki - https://github.com/goobz22/goobs-repo/wiki/StyledComponent

## Server Actions

The following server actions are included in this release:

- `src/actions/server/form/store/reusableStore.ts`: A reusable store for caching form data on the server. This is a TypeScript redis alternative

- `src/actions/server/form/getFormData.ts`: A server action for retrieving form data.

## Usage

To use the components and utilities in your project, you can import them from the `goobs-repo` package. For example:

```jsx
import {
  CustomButton,
  CustomGrid,
  StyledComponent
  Typography,
  RadioGroup,
  ConfirmationCodeInputs
} from 'goobs-repo'
```

Please refer to the individual component and utility files for more details on their usage and available props.

## License

This project is licensed under the MIT License.

## Feedback and Contributions

We welcome feedback, bug reports, and contributions. If you encounter any issues or have feature requests, please open an issue on the [GitHub repository](https://github.com/goobz22/goobs-repo/issues).

If you would like to contribute to the project, please fork the repository and submit a pull request with your changes.

If you would like to request a this ported over to a different design system, a feature/capability or more information on this project please reach out to Matthew Goluba.

## Contact

For any questions or inquiries, please contact Matthew Goluba.

- Email - mkgoluba@technologiesunlimited.net
- LinkedIn - https://www.linkedin.com/in/matthew-goluba/

The website is in progress and will be shared here soon

Please email for the quickest response
