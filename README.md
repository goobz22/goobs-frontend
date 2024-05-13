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

Current version: 0.5.0 (beta)

This is a beta release of the tools. It is available via npm to ensure functionality is as expected. We will iron out any kinks and expect version v1 to be production-ready for all components, while some components are already production-ready.

## Components

The following components are included in this release:

### Button

The Button component is a customizable button with support for icons, variants, and styling props. It provides a flexible and reusable way to create buttons in your application.
Props:

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

- `src/components/Grid/index.tsx`: A grid component for creating responsive layouts with customizable columns and spacing.
- `src/components/Typography/index.tsx`: A typography component for rendering text with customizable styles.

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
import { StyledComponent } from 'goobs-repo/components';

function MyComponent() {
  const handleChange = (event) => {
    // Handle input change
  };

  const handleServerValidation = async (formData) => {
    // Perform server-side validation
    // Return a HelperFooterMessage object if validation fails
  };

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
  );
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

Start Adornment:

- For the searchbar variant, it renders a search icon.

End Adornment:

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

## Client Actions

The following client actions are included in this release:

- `src/actions/client/codeconfirmation/useCodeConfirmation.tsx`: A custom hook for handling confirmation code input and validation.

## Usage

To use the components and utilities in your project, you can import them from the `goobs-repo` package. For example:

```jsx
import {
  CustomButton,
  ConfirmationCodeInputs,
  CustomGrid,
  Typography,
} from 'goobs-repo/components'
```

For server actions and client actions, you can import them similarly:

```jsx
import { getReusableStore } from 'goobs-repo/actions/server/form/store/reusableStore'
import { useCodeConfirmation } from 'goobs-repo/actions/client/codeconfirmation/useCodeConfirmation'
import { getUser } from 'goobs-repo/actions/server/user/getUser'
import { updateUser } from 'goobs-repo/actions/server/user/updateUser'
```

Please refer to the individual component and utility files for more details on their usage and available props.

## Upcoming Features

We are moving very quickly, so there may not be detailed release notes for future versions at this time. However, we have exciting features planned, including:

- Auth open source project that uses all of these components and enables people to register and log in their users without having to use a third-party API. It will include secure MFA, email verification, phone number verification, MFA apps, and the ability to use just one type of verification or multiple.

Stay tuned for more updates and releases!

## License

This project is licensed under the MIT License.

## Feedback and Contributions

We welcome feedback, bug reports, and contributions. If you encounter any issues or have feature requests, please open an issue on the [GitHub repository](https://github.com/goobz22/goobs-repo/issues).

If you would like to contribute to the project, please fork the repository and submit a pull request with your changes.

## Contact

For any questions or inquiries, please contact Matthew Goluba.

- Email - mkgoluba@technologiesunlimited.net
- Twitter - https://twitter.com/goobz22
- LinkedIn - https://www.linkedin.com/in/matthew-goluba/

Website is in Progress and will be shared here soon.
