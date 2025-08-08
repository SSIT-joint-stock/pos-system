# POS System Monorepo

A multi-domain Point of Sale (POS) system built with modern technologies and monorepo architecture.

## 🏗️ Architecture

This monorepo contains:
- **Frontend Apps**: Next.js applications for different business domains
- **Backend API**: Express.js server with multi-tenant support
- **Shared Packages**: Reusable components, utilities, and types

## 📁 Project Structure

```
pos-monorepo/
├── apps/
│   ├── main-web/              # Main domain (account, billing)
│   ├── restaurant-web/        # Restaurant domain app
│   ├── retail-web/           # Retail domain app
│   └── api-server/           # Backend API server
├── packages/
│   ├── ui/                   # Shared UI components
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript definitions
│   ├── shared/              # Shared utilities
│   ├── eslint-config/       # ESLint configurations
│   └── typescript-config/   # TypeScript configurations
└── docs/                    # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pos-monorepo

# Install dependencies
npm install

# Build all packages
npm run build:packages
```

### Development

```bash
# Start all applications
npm run dev

# Start specific app
npm run dev --filter=@pos/api-server

# Start all frontend apps
npm run dev:frontend

# Start backend only
npm run dev:backend
```

## 📦 Available Scripts

### Root Level Scripts

```bash
npm run dev                 # Start all apps in development mode
npm run dev:all            # Start all apps in parallel
npm run dev:frontend       # Start all frontend apps
npm run dev:backend        # Start backend server only
npm run build              # Build all packages and apps
npm run build:apps         # Build only apps
npm run build:packages     # Build only packages
npm run lint               # Lint all packages
npm run lint:fix           # Fix lint issues
npm run type-check         # Run TypeScript checks
npm run test               # Run all tests
npm run clean              # Clean build outputs
npm run reset              # Clean and reinstall dependencies
```

### Package-Specific Scripts

```bash
# Build specific package
npm run build --filter=@repo/utils

# Test specific app
npm run test --filter=@pos/api-server

# Lint specific package
npm run lint --filter=@repo/types
```

## 🏢 Business Domains

### Restaurant Domain
- Table management
- Menu management
- Order processing
- Kitchen display
- Reservation system

### Retail Domain
- Product catalog
- Inventory management
- Point of sale
- Customer management
- Loyalty programs

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Mantine v7** - UI component library
- **Tailwind CSS** - Styling
- **Jotai** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **JWT** - Authentication
- **Zod** - Schema validation

### Development Tools
- **Turborepo** - Monorepo build system
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

## 🔧 Configuration

### Environment Variables

Create `.env` files in the respective app directories:

#### API Server (`apps/api-server/.env`)
```env
NODE_ENV=development
PORT=4001
DATABASE_URL=postgresql://user:password@localhost:5432/pos
JWT_SECRET=your-secret-key
```

#### Frontend Apps
```env
NEXT_PUBLIC_API_URL=http://localhost:4001
NEXT_PUBLIC_WS_URL=ws://localhost:4001
NEXT_PUBLIC_DOMAIN_TYPE=restaurant
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests for specific package
npm run test --filter=@repo/utils

# Run tests in watch mode
npm run test:watch
```

## 📝 Code Style

This project uses ESLint and Prettier for code formatting and linting:

```bash
# Check code style
npm run lint

# Fix code style issues
npm run lint:fix
```

## 🚀 Deployment

### Build for Production

```bash
# Build all packages and apps
npm run build

# Build only production apps
npm run build:apps
```

### Docker Support

Each app includes Docker configuration for containerized deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions, please contact the development team.

---

Built with ❤️ using modern web technologies