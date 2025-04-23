# Portfolio

A modern, responsive portfolio website showcasing personal projects and skills, built with React, TypeScript, Tailwind CSS, and Vite.

## Features

- **Responsive Design**: Optimized for desktop and mobile devices using Tailwind CSS.
- **Dynamic Routing**: Client-side routing with React Router and lazy loading for performance.
- **Scalable Structure**: Organized folder structure with components, pages, and types.
- **Error Handling**: Error boundaries for robust user experience.
- **Clean Imports**: Alias `@/` for simplified import paths.

## Technologies

- **React**: Frontend library for building user interfaces.
- **TypeScript**: Static typing for improved code quality.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Vite**: Fast build tool and development server.
- **React Router**: Declarative routing with lazy loading.
- **Git**: Version control with Conventional Commits.

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd my-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder.

## Project Structure

```
my-portfolio/
├── src/
│   ├── assets/           # Images and static assets
│   ├── components/       # Reusable components (common, layout)
│   ├── pages/            # Page components (Home, About, etc.)
│   ├── routes/           # Routing configuration
│   ├── styles/           # Tailwind CSS and global styles
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
├── public/               # Static files
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # Project documentation
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/my-feature`).
3. Commit changes using Conventional Commits (e.g., `feat: add new feature`).
4. Push to the branch (`git push origin feat/my-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Contact

- Email: bvillena2000@gmail.com
- GitHub: [github.com/BrucceVT](https://github.com/BrucceVT)
- LinkedIn: [linkedin.com/in/brucce-villena-terreros](https://pe.linkedin.com/in/brucce-villena-terreros-0432aa183)