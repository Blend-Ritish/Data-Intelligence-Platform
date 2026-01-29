# Frontend - Data Insights Hub

## Overview

A modern, responsive React-based dashboard application for visualizing and interacting with Snowflake data insights powered by AI. Built with **React 18**, **TypeScript**, **Vite**, and **shadcn/ui** components. Features **dynamic connection configuration** with secure credential management and **selective table analysis**.

## 🆕 New Features

### 1. Connection Configuration Slider
- **UI-based credential input** - No need to edit configuration files
- **Secure .pem file upload** - File validation and upload handling
- **Two-step workflow**:
  1. Enter credentials → Connect & Fetch Tables
  2. Select tables → Run Analysis
- **Visual feedback** - Loading states, error messages, success indicators

### 2. Selective Table Analysis
- **Browse available tables** - Dynamic list fetched from Snowflake
- **Checkbox selection** - Pick specific tables to analyze
- **Select All option** - Quick selection of all tables
- **Visual count display** - Shows "X of Y tables selected"

### 3. Enhanced Data Quality Display
- **Merged view** - Combined Data Quality & Transformation section
- **Consistent formatting** - "Issue:" prefix for all quality problems
- **Actionable fixes** - "Fix:" and "Action:" displayed together
- **Quality score display** - Visual score in section header

### 4. Improved Error Handling
- **Null value handling** - Graceful display of missing KPI values
- **Type-safe formatting** - Number vs string value detection
- **N/A fallbacks** - Clear indicators for unavailable data

## Architecture

### Technology Stack

- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **Routing**: React Router DOM 6.30.1
- **State Management**: React Context API + TanStack Query
- **UI Framework**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom themes
- **Charts**: Recharts 2.15.4
- **Form Handling**: React Hook Form + Zod validation
- **Package Manager**: Bun (with npm/yarn fallback)

### Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components (40+ components)
│   │   ├── ChatbotSlider.tsx        # AI chat interface
│   │   ├── ConnectionConfigSlider.tsx  # **NEW** Credential configuration
│   │   ├── ConnectionForm.tsx       # Legacy connection form
│   │   ├── DomainInsights.tsx       # Main insights visualization (enhanced)
│   │   ├── Header.tsx               # App header with navigation
│   │   ├── HistorySlider.tsx        # Analysis history sidebar
│   │   ├── ResultsDisplay.tsx       # Legacy results display
│   │   ├── SettingsSlider.tsx       # Settings panel
│   │   └── ThemeToggle.tsx          # Light/dark mode toggle
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx      # Authentication state
│   │   └── ThemeContext.tsx     # Theme management
│   ├── hooks/              # Custom React hooks
│   │   ├── use-mobile.tsx       # Mobile detection
│   │   └── use-toast.ts         # Toast notifications
│   ├── lib/                # Utility functions
│   │   └── utils.ts             # Class name utilities
│   ├── pages/              # Route pages
│   │   ├── Dashboard.tsx        # Main dashboard (enhanced)
│   │   ├── Index.tsx            # Landing page (redirects)
│   │   ├── Login.tsx            # Login page
│   │   ├── NotFound.tsx         # 404 page
│   │   ├── Profile.tsx          # User profile
│   │   └── Settings.tsx         # Application settings
│   ├── types/              # TypeScript definitions
│   │   └── index.ts             # All type definitions
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
│   ├── fonts/             # Custom fonts
│   └── robots.txt
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── components.json        # shadcn/ui configuration
```

## Core Features

### 1. **Connection Configuration Slider** (`components/ConnectionConfigSlider.tsx`) **NEW**

A two-step wizard for configuring Snowflake connections:

**Step 1: Credential Input**
- Account, User, Role, Warehouse, Database, Schema fields
- Private key file upload (.pem only)
- Optional passphrase input
- Form validation and error handling

**Step 2: Table Selection**
- Displays all available tables from schema
- Individual checkbox selection
- "Select All" toggle
- Visual count of selected tables
- Error handling for connection failures

**API Integration:**
```typescript
// Fetch tables
POST /list-tables (multipart/form-data)

// Run analysis
POST /run-analysis (multipart/form-data with selected tables)
```

**Workflow:**
```typescript
handleFetchTables() → setTables() → setStep('tables')
handleRunAnalysis() → onAnalysisStart() → window.location.reload()
```

### 2. **Dashboard** (`pages/Dashboard.tsx`)

The central hub that:
- Fetches latest analysis report from backend (`/clean-report`)
- Opens connection slider on "Load Analysis" click
- Displays comprehensive data insights via `DomainInsights` component
- Manages sidebar panels (History, Chat, Settings)
- Handles loading states during analysis

**Key State Management:**
```typescript
const [isConnectionOpen, setIsConnectionOpen] = useState(false);
const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);

const handleLoadAnalysis = () => setIsConnectionOpen(true);
const handleAnalysisStart = () => setIsRunningAnalysis(true);
```

### 3. **Domain Insights** (`components/DomainInsights.tsx`) **ENHANCED**

Main visualization component displaying:
- **Schema Overview**: Database name, summary text, key points
- **Summary Cards**: Tables count, quality score, charts, KPIs
- **Tables & Relationships**: Interactive table list with relationship mapping
- **Data Quality & Transformation**: **MERGED** section showing:
  - Issue formatting: "Issue: {problem_type}"
  - Fix suggestions with actions
  - Quality score in header
  - Unified display to avoid duplication
- **KPIs**: Business metrics with null-safe value display
- **Charts**: Dynamic line/bar charts using Recharts

**Enhanced KPI Display:**
```typescript
{k.value !== null && k.value !== undefined 
  ? (typeof k.value === 'number' ? k.value.toLocaleString() : k.value)
  : 'N/A'}
```

**Merged Quality Section:**
```tsx
<CardTitle>
  Data Quality ({data_quality.overall_score}) & Transformation
</CardTitle>
{data_quality.issues.map((q, idx) => (
  <div>
    <div>Issue: {q.issue}</div>
    <div>Fix: {q.suggested_fix}</div>
    {transformations[idx] && (
      <div>Action: {transformations[idx].action}</div>
    )}
  </div>
))}
```

**Data Structure:**
```typescript
interface DomainReport {
  status: 'success' | 'error';
  data: {
    meta: { load_id, generated_at, schema_analyzed }
    summary: { tables_count, kpis_count, charts_count, quality_score }
    understanding: { total_tables, tables[], relationships[] }
    kpis: [ { name, description, sql, value } ]
    charts: [ { name, chart_type, x_axis, y_axis, sample_data[] } ]
    data_quality: { overall_score, issues[] }
    transformations: [ { table, column, issue, action } ]
    insights: { summary, key_points[] }
  }
}
```

### 3. **AI Chatbot** (`components/ChatbotSlider.tsx`)

Conversational interface with:
- **Text-to-Speech**: Browser speech synthesis for responses
- **Speech-to-Text**: Voice input using Web Speech API
- **Context-Aware**: Queries latest analysis report
- **Backend Integration**: `POST /chat` endpoint

**Features:**
- Message history with timestamps
- Loading states
- Audio playback with progress bar
- Voice input with visual feedback

### 4. **Authentication** (`contexts/AuthContext.tsx`)

Simple authentication system:
- Mock login (demo purposes)
- Local storage persistence
- Profile management
- Password updates
- Protected routes

### 5. **Theme Management** (`contexts/ThemeContext.tsx`)

Dark/light mode toggle with:
- System preference detection
- Local storage persistence
- Tailwind CSS variables

## API Integration

### Backend Endpoints Used

1. **`GET http://127.0.0.1:8080/clean-report`**
   - Fetches latest analysis report
   - Called on Dashboard mount
   - Transforms key_points from API format to UI format

2. **`GET http://127.0.0.1:8080/run-analysis`**
   - Triggers new analysis pipeline
   - Shows loading state
   - Refreshes dashboard on completion

3. **`POST http://127.0.0.1:8080/chat`**
   - Sends user message
   - Receives AI-generated answer
   - Context-aware responses

### Data Transformation

The frontend transforms backend responses for UI compatibility:

```typescript
// API returns complex key_points structure
// Frontend transforms to simple string array
if (parsedData.insights.key_points) {
  const transformedKeyPoints: string[] = [];
  keyPoints.forEach((kp: any) => {
    if (kp.main_data_domains) {
      transformedKeyPoints.push(`Main domains: ${kp.main_data_domains.join(', ')}`);
    }
    // ... more transformations
  });
  parsedData.insights.key_points = transformedKeyPoints;
}
```

## Component Library

### shadcn/ui Components (40+ components)

All located in `src/components/ui/`:
- **Layout**: Card, Sheet, Drawer, Sidebar, Separator, Tabs
- **Forms**: Button, Input, Textarea, Select, Checkbox, Radio, Switch
- **Data Display**: Table, Badge, Avatar, Skeleton, Progress, Chart
- **Feedback**: Alert, Toast, Dialog, Popover, Tooltip, Hover Card
- **Navigation**: Breadcrumb, Menubar, Navigation Menu, Pagination
- **Advanced**: Calendar, Command, Carousel, Collapsible, Resizable

### Custom Components

- **Header**: App navigation with user menu
- **ThemeToggle**: Sun/moon icon toggle
- **NavLink**: Active route highlighting
- **DomainInsights**: Main data visualization
- **ChatbotSlider**: AI chat interface
- **HistorySlider**: Analysis history
- **SettingsSlider**: App settings

## Styling

### Tailwind Configuration

Custom theme with:
- **Colors**: Primary, accent, muted, destructive
- **Animations**: Slide-up, fade-in, pulse
- **Custom classes**: gradient-hero, shadow-glow, shadow-elevated
- **Dark mode**: Class-based with `next-themes`

### CSS Variables

Defined in `index.css`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --accent: 210 40% 96.1%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode overrides */
}
```

## Installation & Setup

### Prerequisites
- Node.js 18+ (or Bun runtime)
- npm/yarn/bun package manager

### Installation

1. **Install dependencies:**
```bash
npm install
# or
bun install
```

2. **Run development server:**
```bash
npm run dev
# or
bun run dev
```

Server starts on `http://localhost:8080`

3. **Build for production:**
```bash
npm run build
# or
bun run build
```

4. **Preview production build:**
```bash
npm run preview
```

### Environment Configuration

No `.env` file needed for frontend. Backend URL is hardcoded:
```typescript
const response = await fetch('http://127.0.0.1:8080/clean-report');
```

For production, update URLs to your backend domain.

## Development Workflow

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `App.tsx`:
```tsx
<Route path="/new-page" element={<NewPage />} />
```

### Adding shadcn/ui Components

```bash
npx shadcn-ui@latest add [component-name]
```

Example:
```bash
npx shadcn-ui@latest add dropdown-menu
```

### Type Safety

All API responses should be typed in `src/types/index.ts`:
```typescript
export interface NewDataType {
  field1: string;
  field2: number;
}
```

## Key UI Patterns

### Loading States
```tsx
{isFetchingData ? (
  <div className="flex items-center justify-center h-96">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
) : (
  <DomainInsights report={report} />
)}
```

### Error Handling
```tsx
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error();
} catch (error) {
  console.error('Failed:', error);
  alert('Operation failed');
}
```

### Responsive Design
```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols */}
</div>
```

## Browser Support

- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Speech APIs**: Chrome/Edge (full support), Safari/Firefox (limited)
- **Required features**: ES2020, CSS Grid, Flexbox, CSS Variables

## Performance Optimizations

- **Code splitting**: Automatic route-based splitting with React Router
- **Lazy loading**: Dynamic imports for heavy components
- **Tree shaking**: Vite automatically removes unused code
- **CSS purging**: Tailwind purges unused styles
- **Asset optimization**: Vite handles image/font optimization

## Accessibility

- **Keyboard navigation**: All interactive elements focusable
- **ARIA labels**: Radix UI components have built-in ARIA
- **Color contrast**: WCAG AA compliant
- **Screen readers**: Semantic HTML structure

## Troubleshooting

### Issue: "Cannot connect to backend"
- Ensure backend is running on port 8080
- Check CORS configuration in backend
- Verify URL in fetch calls

### Issue: "Charts not rendering"
- Check data format matches `DomainChartDataPoint[]`
- Verify x_axis and y_axis keys exist in data
- Check for null/undefined values

### Issue: "Theme not persisting"
- Clear localStorage
- Check ThemeProvider wrapping
- Verify CSS variables are defined

## Scripts

```json
{
  "dev": "vite",                    // Development server
  "build": "vite build",            // Production build
  "build:dev": "vite build --mode development",
  "lint": "eslint .",               // Lint code
  "preview": "vite preview"         // Preview production build
}
```

## Contributing

1. Follow existing component structure
2. Use TypeScript for all new code
3. Follow Tailwind CSS class ordering
4. Add types in `types/index.ts`
5. Use shadcn/ui components when possible

## License

Proprietary - Data Insights Hub

## Support

For issues and questions, contact the frontend development team.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

