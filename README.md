# mAI AgenticFramework UI

A modern React application that serves as the user interface for both the mAI AgenticFramework chatbot and its observability dashboard.

## Project Overview

This project provides two main interfaces:

1. **Framework UI**: A chat interface allowing users to interact with the mAI AgenticFramework, an advanced agentic AI system.

2. **Observability UI**: A dashboard interface displaying performance metrics and analytics for AI interactions.

## Key Features

### Framework UI

- **Interactive Chat Interface**: Engage with the AI agent through a clean, intuitive chat interface
- **Real-time Metrics**: View performance data for each AI response including latency and token consumption
- **Authentication**: Secure user authentication to access the chat interface
- **Detailed Response Analysis**: Access verbose information about response generation

### Observability Dashboard

- **Performance Metrics**: Visualize key AI performance indicators
- **Comparison Charts**: Compare mAI performance with other frameworks
- **Historical Data**: Track performance trends over time
- **Detailed Analytics**: Drill down into specific metrics for deeper analysis

## Technical Architecture

- **Frontend**: React with TypeScript, built with Vite
- **UI Components**: shadcn/ui components with Tailwind CSS
- **State Management**: React Context API with TanStack Query for data fetching
- **Routing**: React Router for navigation
- **Authentication**: Custom authentication with Supabase
- **Database**: Supabase for storing user data and metrics

## How It Works

1. Users interact with the AI through the chat interface
2. The framework processes requests and returns responses
3. Performance metrics are captured and stored in Supabase
4. The observability dashboard visualizes these metrics

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

```sh
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd agentic-interaction-ui

# Install dependencies
npm install
# or
yarn
```

### Running the Application

```sh
# Start development server
npm run dev
# or
yarn dev
```

npx -y @modelcontextprotocol/server-postgres postgresql://postgres.qijceioeubmccdmissne:sT!Bz69ZZGbd6YF@aws-0-us-east-2.pooler.supabase.com:5432/postgres



The application will be available at http://localhost:8080.

### Building for Production

```sh
# Build for production
npm run build
# or
yarn build
```

## Project Structure

- `src/components`: UI components
- `src/contexts`: React context providers
- `src/hooks`: Custom React hooks
- `src/pages`: Application pages
- `src/services`: API service functions
- `src/types`: TypeScript type definitions
- `src/lib`: Utility functions and constants

## Contributing

Guidelines for contributing to the project.

## License

Information about the project license.
