# React Frontend Application

This is a modern React frontend application built with TypeScript and Vite. It features a responsive UI built with Tailwind CSS and Radix UI components.

## Technologies Used

- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [React Router](https://reactrouter.com/)
- [SWC](https://swc.rs/) for Fast Refresh

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/juliocanizalez/nlc-test
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to http://localhost:5173

### Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## Docker Setup

The application can be run in a Docker container using the provided Dockerfile.

### Building the Docker Image

```bash
docker build -t frontend-app .
```

### Running the Docker Container

```bash
docker run -p 80:80 frontend-app
```

This will start the application and make it available at http://localhost:80

## ESLint Configuration

The project includes a comprehensive ESLint setup for code quality.

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    // For stricter rules
    ...tseslint.configs.strictTypeChecked,
    // For stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```
