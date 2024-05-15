# goobs-repo

goobs-repo is a collection of reusable components and utilities for building web applications with React and Next.js. It provides a set of tools to streamline development and enhance functionality.

## Installation

You can install goobs-repo using npm or yarn:

### npm

```bash
npm i goobs-repo
```

### Yarn

```bash
yarn add goobs-repo
```

The NPM repo is available here - https://www.npmjs.com/package/goobs-repo

This entire repository is written in typescript and there is no need for a types/ install file

## Version

Current version: 0.7.0 (beta)

This is a beta release of the tools. It is available via npm to ensure functionality is as expected. We will iron out any kinks and expect version v1 to be production-ready for all components, while some components are already production-ready. Installation confirmed working with install instructions below. 

## Integrating goobs-repo with Next.js

This guide explains how to integrate the goobs-repo package with a Next.js project, resolving any compatibility issues that may arise.

**Step 1: Install the required dependencies**

In your Next.js project directory, run the following command to install the necessary dependencies:

`yarn add --dev next-transpile-modules babel-loader @babel/preset-react @babel/preset-typescript`
`npm install --save-dev next-transpile-modules babel-loader @babel/preset-react @babel/preset-typescript`

This command installs the following packages as dev dependencies:

- next-transpile-modules: A package that enables transpilation of modules from the node_modules directory using the Next.js Babel configuration.
- babel-loader: The Babel loader for webpack, which allows transpiling JavaScript files using Babel and webpack.
- @babel/preset-react: The Babel preset for React, which includes the necessary plugins for transpiling React code.
- @babel/preset-typescript: The Babel preset for TypeScript, which includes the necessary plugins for transpiling TypeScript code.

**Step 2: Update the next.config.js file**
Replace the contents of your next.config.js file with the following code or add the following transpile code:

```
/** @type {import('next').NextConfig} */
// next.config.js

import transpileModules from 'next-transpile-modules';

const withTM = transpileModules(['goobs-repo']);

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }

    config.module.rules.push({
      test: /\.tsx?$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      ],
    });

    return config;
  },
};

export default withTM(nextConfig);
```

Then run yarn build - see this discussion for more info - https://github.com/goobz22/goobs-repo/discussions/21

## Components

The following components are included in this release:

### Button

The Button component is a customizable button with support for icons, variants, and styling props. It provides a flexible and reusable way to create buttons in your application.

#### Props:

- `src/components/Button/index.tsx`
- text (optional): The text to display on the button.
- variant (optional): The variant of the button (e.g., 'contained', 'outlined', 'text').
- fontsize (optional): The font size of the button text.
- icon (optional): The icon to display on the button.
- iconlocation (optional): The location of the icon ('left' or 'right').
- type (optional): The type of the button (e.g., 'button', 'submit', 'reset').
- onClick (optional): The function to be called when the button is clicked.
- fontcolor (optional): The color of the button text.
- helperfooter (optional): An object containing helper footer properties (status, statusMessage).

#### Usage:

```jsx
import { CustomButton } from 'goobs-repo/components'

function MyComponent() {
  const handleClick = () => {
    // Handle button click
  }

  return (
    <CustomButton
      text="Click me"
      variant="contained"
      fontsize="merriparagraph"
      icon={<StarIcon />}
      iconlocation="left"
      onClick={handleClick}
      fontcolor="white"
      helperfooter={{
        status: 'error',
        statusMessage: 'Error message',
      }}
    />
  )
}
```

### CustomGrid

The CustomGrid component is a highly customizable and flexible grid system built with React and Material-UI. It allows you to create complex grid layouts with ease, providing a wide range of configuration options for grids, rows, columns, and cells.

#### Features

- Configurable grid structure with a variable number of rows and columns.
- Customizable grid, row, and column configurations, including margins, widths, heights, and alignments.
- Support for custom components within grid cells.
- Responsive design with automatic column resizing based on screen size.
- Customizable cell borders and minimum heights.
- Animation support for grid components.

#### Props

The CustomGrid component accepts the following props:

- gridconfig (optional): An object or an array of objects representing the grid configuration. It includes properties such as the number of rows, grid name, margins, width, and animation.
- rowconfig (optional): An object or an array of objects representing the row configuration. It includes properties such as the number of columns, grid name, alignment, row width, margins, and animation.
- columnconfig (optional): An array of objects representing the column configuration. Each object includes properties such as the row and column position, grid name, alignment, column width, margins, animation, and custom component.
- cellconfig (optional): An object representing the cell configuration. It includes properties such as border style and minimum height.

#### Usage:

```jsx
import { CustomGrid } from 'goobs-repo/components'

function MyComponent() {
  const gridConfig = {
    rows: 2,
    gridname: 'testgrid',
    margintop: 10,
    marginbottom: 2,
    marginright: 2,
    marginleft: 10,
    gridwidth: '100%',
    animation: 'none',
  }

  const rowConfig = {
    columns: 3,
    gridname: 'testgrid',
    alignment: 'center',
    rowwidth: '100%',
    marginbetweenrows: 2,
    margintop: 2,
    marginbottom: 2,
    marginright: 0,
    marginleft: 2,
    animation: 'none',
  }

  const columnConfig = [
    {
      row: 1,
      column: 1,
      gridname: 'testgrid',
      alignment: 'left',
      columnwidth: '33.33%',
      margintop: 1,
      marginbottom: 1,
      marginright: 0,
      marginleft: 0,
      animation: 'none',
      component: <Typography variant="h4" text="Column 1" />,
    },
  ]

  return (
    <CustomGrid
      gridconfig={gridConfig}
      rowconfig={rowConfig}
      columnconfig={columnConfig}
    />
  )
}
```

#### Default Configurations

The CustomGrid component provides default configurations for the grid, row, and column settings. These default configurations can be found in the src/components/Grid/defaultconfig.tsx file.

- defaultGridConfig: The default configuration for the grid.
- defaultRowConfig: The default configuration for rows.
- defaultColumnConfig: The default configuration for columns.

You can override these default configurations by providing custom values through the respective props.

#### Types

The CustomGrid component uses the following types defined in src/types/grid/customgrid/index.ts:

- gridconfig: Represents the configuration options for the grid.
- rowconfig: Represents the configuration options for a row.
- columnconfig: Represents the configuration options for a column.
- CustomGridProps: Extends the GridProps from Material-UI and includes the custom grid configuration props.
- cellconfig: Represents the configuration options for a grid cell.

These types provide type safety and autocompletion when configuring the CustomGrid component.

#### Component Files

- src/components/Grid/index.tsx: The main implementation of the CustomGrid component.
- src/components/Grid/defaultconfig.tsx: Contains the default configurations for the grid, row, and column settings.

#### Conclusion

The CustomGrid component offers a powerful and flexible way to create complex grid layouts in your React application. With its extensive configuration options and responsive design, you can easily customize the appearance and behavior of your grids to suit your specific needs.

Experiment with different grid configurations, row and column settings, and cell customization to create visually appealing and functional layouts for your components.

### Typography

The Typography component is a text component for rendering customizable typography.

#### Props:

- src/components/Typography/index.tsx
- text (optional): The text content to be rendered.
- fontvariant (optional): The variant of the typography component.
- fontcolor (optional): The color of the typography text.
- columnconfig (optional): The configuration object for the grid column.
- cellconfig (optional): The configuration object for the grid cell.

All other props from Material-UI's Typography component are also supported.

### StyledComponent

The StyledComponent is a versatile and customizable input component built with React and Material-UI. It provides a range of input variants and supports various styling options to match your application's design requirements.

#### Features

- Multiple input variants: textfield, phonenumber, password, dropdown, searchbar, and more.
- Customizable styling properties for outline color, icon color, background color, font colors, and more.
- Built-in validation and error handling with helper footer messages.
- Integration with server-side validation actions.
- Debounced validation to optimize performance.
- Responsive design and compatibility with different screen sizes.

#### Props

The StyledComponent accepts the following props:

src/components/StyledComponent/index.tsx

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

#### Usage

```jsx
import { StyledComponent } from 'goobs-repo/components'

function MyComponent() {
  const handleChange = event => {
    // Handle input change
  }

  const handleServerValidation = async formData => {
    // Perform server-side validation
    // Return a HelperFooterMessage object if validation fails
  }

  return (
    <StyledComponent
      name="username"
      componentvariant="textfield"
      label="Username"
      onChange={handleChange}
      serverActionValidation={handleServerValidation}
      helperfooter={{
        status: 'error',
        statusMessage: 'Username is required',
      }}
    />
  )
}
```

#### Hooks

The StyledComponent utilizes several custom hooks to enhance its functionality:

- src/hooks/styledcomponent/useDropdown.tsx: Handles the dropdown functionality, including opening/closing the dropdown, filtering options, and selecting an option.
- src/hooks/styledcomponent/usePhoneNumber.tsx: Handles phone number formatting and updating the input value.
- src/hooks/styledcomponent/usePassword.tsx: Handles password visibility toggling.
- src/hooks/styledcomponent/useSearchbar.tsx: Handles the searchbar functionality, including filtering options based on the search query.

#### Adornments

The StyledComponent also includes start and end adornments for additional visual elements and interactivity. The adornments are rendered based on the componentvariant prop.

##### Start Adornment:

- For the searchbar variant, it renders a search icon.

##### End Adornment:

- For the password variant, it renders a show/hide eye icon to toggle password visibility.
- For the dropdown variant, it renders a down arrow icon.
- For the searchbar variant, it renders an empty end adornment for spacing.

The adornments are defined in the src/components/StyledComponent/adornments.tsx file.

#### Validation

The StyledComponent supports both client-side and server-side validation. Client-side validation is handled by the component itself, while server-side validation is performed through the serverActionValidation prop.

When the serverActionValidation prop is provided, the component debounces the validation function to optimize performance. The validation result is then displayed in the helper footer message.

#### Styling

The StyledComponent utilizes Material-UI's styling system to provide a wide range of customization options. The component accepts various styling props to control the appearance of the input, label, outline, icons, and more.

The component also extends the Material-UI's OutlinedInput, FormControl, and InputBase components to support additional color overrides.

The prop types for the StyledComponent are defined in src/types/styledcomponent/index.ts.

#### Utilities

The StyledComponent uses utility functions for phone number formatting, located in src/utils/phone/format.ts.

## Server Actions

The following server actions are included in this release:

- `src/actions/server/form/store/reusableStore.ts`: A reusable store for caching form data on the server. It provides a simple and efficient way to store and retrieve form data across requests. The store utilizes a JSON file storage mechanism for data persistence.

#### Usage:

```jsx
import {
  getReusableStore,
  setReusableStore,
} from 'goobs-repo/actions/server/form/store/reusableStore'

async function handleFormSubmit(formData) {
  // Store form data using the reusable store
  await setReusableStore({
    storename: 'myFormStore',
    identifier: 'userId123',
    value: formData,
    expirationTime: Date.now() + 24 * 60 * 60 * 1000, // Expiration time: 24 hours from now
  })

  // Retrieve form data from the reusable store
  const storedFormData = await getReusableStore('myFormStore', 'userId123')
  console.log('Stored form data:', storedFormData)
}
```

- `src/actions/server/form/store/crypt.ts`: Encryption and decryption utilities for secure data storage. These utilities help protect sensitive data by encrypting it before storing and decrypting it when retrieving from the store. The encryption key and initialization vector (IV) are securely sourced from environment variables.

- `src/actions/server/form/getFormData.ts`: A server action for retrieving form data.
- `src/actions/server/user/getUser.tsx`: A server action for fetching user data from the database.
- `src/actions/server/user/updateUser.tsx`: A server action for updating user data in the database.

## Usage

To use the components and utilities in your project, you can import them from the `goobs-repo` package. For example:

```jsx
import {
  CustomButton,
  CustomGrid,
  StyledComponent
  Typography,
} from 'goobs-repo/components'
```

For server actions, you can import them similarly:

```jsx
import { getReusableStore } from 'goobs-repo/actions/server/form/store/reusableStore'
import { getUser } from 'goobs-repo/actions/server/user/getUser'
import { updateUser } from 'goobs-repo/actions/server/user/updateUser'
```

Please refer to the individual component and utility files for more details on their usage and available props.

## Upcoming Features

We are thrilled to announce that we are actively working on an exciting new feature for goobs-repo: a comprehensive open-source authentication system. This authentication system leverages the powerful components and utilities provided by goobs-repo to enable seamless user registration and login functionality without the need for third-party APIs.

Here's a sneak peek of what you can expect from the upcoming authentication system:

### Configurable Email Verification

Our authentication system will provide the flexibility to configure email verification based on your application's requirements. Through intuitive props, you can easily enable or disable email verification for different flows such as registration, login, and forgot password. By default, email verification will be used in conjunction with password verification for the login flow, ensuring a secure authentication process.

### Configurable Phone Number Verification

Similar to email verification, our authentication system will allow you to configure phone number verification through props. You can choose to enable phone number verification for registration, login, and forgot password flows, either independently or in combination with email verification. The default configuration will utilize phone number verification for the registration flow, providing an additional layer of security.

### Flexible Verification Options

We understand that different applications have unique security requirements. That's why our authentication system will provide flexibility in terms of verification methods. Through props, you can configure the system to use either email verification, phone number verification, or a combination of both for the forgot password flow. By default, the forgot password flow will allow users to choose between email and phone number verification in the UI, but you can customize this behavior to force a specific verification method based on your application's needs.

Under the hood, the authentication system will utilize a range of server actions to handle various aspects of user registration, login, and token management. These server actions will work seamlessly with the ReusableStore utility to store and retrieve user data securely during the registration and verification processes.

The authentication flow will be carefully designed to ensure a smooth and intuitive user experience. From the initial registration setup to the account information collection and verification steps, users will be guided through the process with clear instructions and helpful feedback.

### Configurable Token-Based Authentication

Our authentication system utilizes a robust token-based approach to securely authenticate users. Through intuitive configuration options, you can easily customize the behavior of the authentication flow to suit your application's requirements.

Multiple Token Types: The system supports multiple token types, including "registered", "verified", and "loggedIn" tokens. Each token type serves a specific purpose and can be configured independently.

Secure Token Generation: Tokens are generated using cryptographically secure random bytes, ensuring the integrity and uniqueness of each token.
Customizable Token Expiration: You have full control over the expiration time of each token type. By default, tokens are set to expire after a specified duration (e.g., 12 hours), but you can easily adjust this based on your security needs.

Token Validation and Comparison: The authentication system performs comprehensive token validation by comparing the token stored in the client-side cookies with the corresponding token in the database. This ensures that only valid and authenticated users can access protected resources.

### Seamless Cookie Management

The authentication system seamlessly manages client-side cookies to store and retrieve authentication tokens. It provides a secure and efficient way to maintain user sessions across requests.

Secure Cookie Options: Cookies are set with secure options, including HTTP-only flag, strict same-site policy, and secure flag (in production environments). This helps protect against cross-site scripting (XSS) attacks and ensures that cookies are only transmitted over secure connections.
Automatic Cookie Updates: When tokens are updated or invalidated, the corresponding cookies are automatically updated or deleted, ensuring synchronization between the client and server.

Domain-Based Cookie Configuration: The system intelligently sets the cookie domain based on the environment (development or production), allowing for seamless integration across different deployment scenarios.

### Server-Side Authentication Utilities

The authentication system provides powerful server-side utilities to handle various authentication scenarios efficiently.

Server Components Authentication: The serverComponentsAuthUtility function enables authentication within server components. It compares the tokens stored in cookies with the corresponding tokens in the database, determining the validity and expiration status of each token type. It returns the validation result and the valid tokens for further use in server components.

Server Actions Authentication: The serverActionsAuthUtility function facilitates authentication within server actions. It performs token validation, updates user data in the database, and manages cookie updates based on the authentication status. It ensures that server actions are executed only for authenticated users and handles token expiration and invalidation scenarios.

### Flexible Token Updates and Management

The authentication system offers flexible token update and management capabilities to accommodate different authentication flows and requirements.

Token Generation and Updates: The updateToken function allows you to generate new tokens and update existing tokens with customizable attributes and expiration times. It provides a convenient way to create and manage tokens throughout the authentication process.

Cookie Updates: The updateCookie function enables seamless updates of authentication cookies. It handles the setting, updating, and deletion of cookies based on the provided options, ensuring synchronization between the client and server.

### Comprehensive Token Comparison and Validation

The compareCookietoDB function lies at the core of the authentication system's token validation process. It performs a thorough comparison between the tokens stored in cookies and the corresponding tokens in the database.

Token Existence and Validity Checks: The function checks the existence and validity of each token type (registered, verified, loggedIn) in both the cookies and the database. It identifies scenarios where tokens are missing, expired, or invalid, and updates the validation result accordingly.

Detailed Validation Summary: The function provides a detailed validation summary, logging the status of each token comparison (valid, expired, invalid, missing) for each token type. This aids in debugging and understanding the authentication flow.

Identifier Preparation: The function prepares an identifier object containing the token strings from the cookies, which can be used for further actions or database updates.

With these robust features, the upcoming authentication system in goobs-repo aims to provide a comprehensive and customizable solution for user authentication. It combines the power of secure token-based authentication, seamless cookie management, and flexible server-side utilities to deliver a reliable and efficient authentication experience for your applications.

Stay tuned for the release of this authentication system and get ready to take your application's security to the next level with goobs-repo!

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

The website is in progress and will be shared here soon.

Please email for the quickest response
