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

This entire repository is written in typescript and there is no need for a types/ install file

## Version

Current version: 0.4.0 (beta)

This is a beta release of the tools. It is available via npm to ensure functionality is as expected. We will iron out any kinks and expect version v1 to be production-ready for all components, while some components are already production-ready.

## Components

The following components are included in this release:

- `src/components/Button/index.tsx`: A customizable button component with support for icons, variants, and styling props.
- `src/components/ConfirmationCodeInput/index.tsx`: A confirmation code input component for handling verification codes.
- `src/components/Grid/index.tsx`: A grid component for creating responsive layouts with customizable columns and spacing.
- `src/components/Typography/index.tsx`: A typography component for rendering text with customizable styles.

## Server Actions

The following server actions are included in this release:

- `src/actions/server/form/store/reusableStore.ts`: A reusable store for caching form data on the server.
- `src/actions/server/form/store/dataField.ts`: A utility for managing data fields in the reusable store.
- `src/actions/server/form/store/crypt.ts`: Encryption and decryption utilities for secure data storage.
- `src/actions/server/form/getFormData.ts`: A server action for retrieving form data.

## Client Actions

The following client actions are included in this release:

- `src/actions/client/codeconfirmation/useCodeConfirmation.tsx`: A custom hook for handling confirmation code input and validation.

## Usage

To use the components and utilities in your project, you can import them from the `goobs-repo` package. For example:

```jsx
import { CustomButton, ConfirmationCodeInputs, CustomGrid, Typography } from 'goobs-repo/components';
```

For server actions and client actions, you can import them similarly:

```jsx
import { getReusableStore } from 'goobs-repo/actions/server/form/store/reusableStore';
import { useCodeConfirmation } from 'goobs-repo/actions/client/codeconfirmation/useCodeConfirmation';
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