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

Current version: 0.4.6 (beta)
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

- `src/components/ConfirmationCodeInput/index.tsx`: A confirmation code input component for handling verification codes.
- `src/components/Grid/index.tsx`: A grid component for creating responsive layouts with customizable columns and spacing.
- `src/components/Typography/index.tsx`: A typography component for rendering text with customizable styles.

## Server Actions

The following server actions are included in this release:

- `src/actions/server/form/store/reusableStore.ts`: A reusable store for caching form data on the server. It provides a simple and efficient way to store and retrieve form data across requests. The store utilizes a JSON file storage mechanism for data persistence.

#### Usage:

```jsx
import { getReusableStore, setReusableStore } from 'goobs-repo/actions/server/form/store/reusableStore'

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

- Generic server action handle for delivering form data to the server action that accesses the reusable store.
- Generic server action for handling the delivery of form data and handing off to the reusable store.
- Generic styled component for handling form data, which can be used as anything with an outlined input or input and is built into the theme and style overrides within MUI. It will be used for textfields, date pickers, dropdowns, phone numbers, search bars, and many more in the future.
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
