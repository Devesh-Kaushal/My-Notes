# My Notes App

An offline-first, modern note-taking application built with Electron, React, and TypeScript. Designed for privacy, speed, and a distraction-free writing experience.

## Features

- **🔒 Offline-First**: All data is stored locally on your machine in `Documents/MyNotes` as Markdown files. No cloud dependency.
- **📝 Rich Text Editor**: Powered by [TipTap](https://tiptap.dev/), supporting headings, lists, tasks, images, and more.
- **⚡ Slash Commands**: Type `/` to access a quick menu for formatting and inserting blocks (Images, PDFs, etc.).
- **📂 File System Based**: Notes are stored as real files. You can open and edit them with any other Markdown editor.
- **🔎 Quick Switcher**: Fast fuzzy search to jump between notes instantly.
- **🌳 Nested Pages**: Organize your thoughts with a hierarchical page structure.
- **🌑 Dark Mode**: A sleek, dark interface designed for focus.
- **⌨️ Keyboard Shortcuts**: Optimized for power users.

## Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/)
- **Frontend**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Editor**: [TipTap](https://tiptap.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (or yarn/pnpm)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Devesh-Kaushal/My-Notes.git
    cd My-Notes
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

### Running Locally

To start the application in development mode with hot-reloading:

```bash
npm run electron:dev
```

### Building for Production

To build the application for your OS (Linux/macOS/Windows):

```bash
npm run electron:build
```

The output will be in the `dist-electron` or `release` directory.

## Project Structure

- `electron/`: Main process code (backend-like services, file system operations).
- `src/`: Renderer process code (React UI).
    - `components/`: UI components (Editor, Sidebar, etc.).
    - `store/`: State management.
    - `hooks/`: Custom React hooks.
    - `styles/`: Global styles and Tailwind configuration.

## License

Distributed under the MIT License. See `LICENSE` for more information.
