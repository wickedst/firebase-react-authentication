# Firebase React Typescript Starter

A boilerplate to help speed up development of Firebase web apps. This is intended to provide a solid foundation for rapid prototyping - to save time and be a realistic basis for production projects built on Firebase.

Uses React Hooks and the React Context API (no Redux).

## What's included

- Typescript
- Firebase cloud functions setup
- Firebase hosting setup
- Bootstrap via React Bootstrap
- Forms with Formik and yup
- User registration with unique usernames, email and password (Firebase authentication)
- Login, Private route and Logged in / Logged out route via React Router
- UI basics like live form validation, user navbar dropdown, alerts and toasts for error / success

## To do

- Proper error handling via a general function (for piping in Sentry
- Meaningful tests -
- User public profiles, editable profiles, account settings (for changing user password and so on)
- Cloud messaging integration
- User sign up email verification

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn install`

Installs project dependencies

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## Configuring environment and firebase

Refer to the .env.sample file to know about how you have to enter firebase keys and configuration. Create .env file and put your own configuration there. The file .env.example consists fake credentials.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
