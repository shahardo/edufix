# EduFix Frontend

The EduFix frontend consists of two implementations:

1. **Static HTML Mock Screens** - Interactive prototypes for design validation and UX testing
2. **React Application** - Full-featured web application built with modern React and TypeScript

This directory contains both implementations, providing a complete frontend solution for the EduFix educational platform.

## 📱 Available Screens

### Student Experience
- **`index.html`** - Student Home Screen
  - Today's lesson overview
  - Task list and progress tracking
  - Achievement system and gamification
  - Navigation to other screens

- **`lesson.html`** - Lesson Workspace
  - Two-column layout with lesson content and Q&A
  - Interactive chat with AI responses
  - Progress tracking and quick actions
  - Real-time Q&A simulation

- **`practice.html`** - Practice Session
  - Multi-choice questions with hint system
  - 3-level hint progression (General → Specific → Step-by-Step)
  - Immediate feedback and explanations
  - Full solution reveal capability

### Teacher Experience
- **`teacher-dashboard.html`** - Teacher Analytics Dashboard
  - Class overview metrics and KPIs
  - Student performance table with filtering
  - Interactive charts (Chart.js integration)
  - Action buttons for assignments and reports

## 🎨 Design Features

### Responsive Design
- **Mobile-first approach** with collapsible navigation
- **Tablet and desktop optimizations**
- **Touch-friendly interfaces**

### Multi-lingual Support
- **EN/עברית toggle buttons** (UI ready for Hebrew RTL)
- **Font Awesome icons** for universal symbols
- **Clean typography** with proper contrast ratios

### Interactive Elements
- **Hover states and transitions**
- **Dynamic content loading** (simulated)
- **Form interactions** and state management
- **Modal dialogs** and confirmations

## 🛠 Technical Stack

- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icon library
- **Chart.js** - Data visualization
- **Vanilla JavaScript** - Interactive functionality
- **Responsive design** - Mobile/tablet/desktop support

## 🚀 Getting Started

1. **Open any HTML file** directly in your browser
2. **Navigate between screens** using the bottom navigation or buttons
3. **Try interactive features**:
   - Language toggle (EN/עברית)
   - Q&A chat in lesson screen
   - Hint system in practice screen
   - Chart interactions in dashboard

## 📋 Screen Specifications

Each screen implements the exact specifications from the PRD mockups:

- **Color schemes**: Blue primary (#0066CC), success green, warning yellow, danger red
- **Typography**: Sans-serif fonts, proper hierarchy (16px-24px-32px)
- **Spacing**: Consistent 4px-8px-16px-24px grid
- **Accessibility**: WCAG AA compliant colors, keyboard navigation ready

## ⚛️ React Application (`frontend/app/`)

The React application provides a modern, interactive frontend for the EduFix platform with full TypeScript support and component-based architecture.

### 🏗️ Architecture

```
frontend/app/
├── src/
│   ├── components/           # React components
│   │   ├── Login.tsx         # User authentication
│   │   ├── StudentDashboard.tsx
│   │   ├── TeacherDashboard.tsx
│   │   ├── ContentManagement.tsx
│   │   └── Practice.tsx      # Practice sessions
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   ├── App.css              # Application styles
│   └── style.css            # Global styles
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite build configuration
```

### 🛠️ Tech Stack

- **React 19** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Axios** - HTTP client for API calls
- **Heroicons** - Modern icon library
- **React Hook Form** - Form handling

### 🚀 Running the React Application

#### Development Server
```bash
cd frontend/app
npm install
npx vite
```
The development server will start on `http://localhost:5173` (or next available port).

#### Production Build
```bash
cd frontend/app
npm run build
npm run preview
```

### 📦 Available Scripts

- `npm run dev` - Start development server (via Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### 🔧 Development

#### Prerequisites
- Node.js 18+
- npm or yarn

#### Key Components
- **Login**: User authentication interface
- **StudentDashboard**: Student home screen with lessons and progress
- **TeacherDashboard**: Teacher analytics and class management
- **ContentManagement**: Content creation and editing tools
- **Practice**: Interactive practice sessions with AI assistance

### 🔌 API Integration

The React app is designed to integrate with the EduFix backend API:

- **Authentication**: Login/logout via `/auth` endpoints
- **Content**: Lesson and practice content via `/content` endpoints
- **Analytics**: Dashboard data via `/analytics` endpoints
- **Practice**: Interactive sessions via `/practice` endpoints

### 🎨 Styling

- **Tailwind CSS** for responsive, utility-first styling
- **PostCSS** for CSS processing and optimization
- **Consistent design system** matching the mock screens
- **Dark/light theme support** (planned)

## 🔄 Next Steps

### Mock Screens
These static HTML files serve as:
- **Design validation** for the PRD specifications
- **User experience testing** foundation
- **Frontend development** blueprint
- **Stakeholder demonstrations**

### React Application
Current status:
- ✅ Basic project structure and components
- ✅ TypeScript configuration
- ✅ Development server running
- 🚧 Component implementation in progress
- 📋 API integration needed
- 🎨 UI/UX refinements required

The mock screens provide the exact component structure and interaction patterns that the React application should implement.
