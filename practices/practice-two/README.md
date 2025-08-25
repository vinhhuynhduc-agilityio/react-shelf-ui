# React Advanced - Practice two

My Book Shelf is a web app for users to sign up, log in, search, preview, borrow, and manage books — like a personal library with a social reading touch.

# Targets

- React Advanced: Apply advanced React techniques to optimize performance, manage state, and handle complex components efficiently.
- React Hook Form: Develop dynamic forms with real-time validation and seamless submission handling.
- Tailwind CSS: Design responsive and customizable UIs by leveraging Tailwind CSS utility classes.
- Responsive Design: Build mobile-first, responsive interfaces using Tailwind’s utility-first approach.
- Zustand: Manage global state with a lightweight and scalable solution, supporting selective state subscriptions and middleware integration.
- React Query: Handle server state efficiently with caching, background updates, and seamless data synchronization.
- React Router DOM: Implement client-side routing with nested routes, route guards, and dynamic navigation in single-page applications.
- Testing: Achieve over 95% unit test coverage using React Testing Library to validate component logic and user interactions.
- React-scan: Detect and optimize unnecessary component re-renders
- Storybook: Develop, document, and test UI components for reusability.

# Technical stacks

- [React](https://react.dev/) v18.3.1 (React lets you build user interfaces out of individual pieces called components.)
- [React Hook Form](https://react-hook-form.com/) v7.53.1 (Lightweight library for form state management and validation with minimal re-renders.)
- [Tailwind CSS](https://tailwindcss.com/) v3.4.14 (Tailwind CSS is a utility-first CSS framework for building responsive and customizable UI components.)
- [Zustand](https://github.com/pmndrs/zustand) v5.0.3 (Zustand is a fast and scalable state management library that uses simplified hooks for managing global state.)
- [React Query](https://tanstack.com/query/) v5.66.0 (React Query helps manage server state in React applications with efficient data fetching, caching, and synchronization.)
- [React Router](https://reactrouter.com/) v5.3.3 (React Router DOM enables dynamic routing in React applications with support for nested and declarative routes.)
- [React-Testing-Library](https://testing-library.com/docs/react-testing-library/intro/) v16.3.0 (React Testing Library builds on top of DOM Testing Library by adding APIs for working with React components.)

# Design

Design via [figma](https://www.figma.com/design/TvvCbZ4IqnjYSBE2NQtAUt/My-Book-Shelf-CRUD?node-id=1-2&p=f&t=e712ipV6fxYAJiLC-0)

# Editor

- Visual Studio Code

# Author

- vinh.huynhduc <[vinh.huynhduc@asnet.com.vn](vinh.huynhduc@asnet.com.vn)>

# Getting started

Step by step to get started this app at your location

## Clone repository with ssh

```bash
git clone git@gitlab.asoft-python.com:vinh.huynhduc/react-advanced-training.git
```

## Install necessary packages

Make sure you are stay at the root of application (`practice-two`), execute the command
to install package dependencies

```bash
Step 1: pnpm install
```

```bash
Step 2: pnpm exec json-server --watch db.json --port 3001 --middlewares ./middleware.cjs
```

```bash
Step 3: pnpm dev
```
