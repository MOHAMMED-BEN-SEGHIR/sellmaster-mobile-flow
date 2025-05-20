
# SellMaster Mobile

A production-ready mobile application for the SellMaster SaaS platform, providing payment tracking and management capabilities.

## Features

### Authentication
- JWT login with secure token storage
- Multi-tenant workspace selection
- Demo user login for testing

### Payment Tracker
- Month selection with calendar interface
- Weekly accordion view with totals
- Daily payment entry with expression support (e.g. 10+15)
- Description field for payment details
- Real-time total calculations (week and month)
- Currency support with symbol display

### Offline-First Design
- Local data storage
- Sync queue for offline changes
- Automatic sync when online

### Theming
- Light and dark mode support
- E-commerce color palette:
  - Primary: #04be94
  - Accent Orange: #fc6638
  - Accent Yellow: #f5a738

### Navigation
- Bottom tab navigation (Dashboard, Payments, Settings)
- Side drawer with additional options

### Security
- Biometric authentication (mockup)
- Two-factor authentication (mockup)

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- React Router v6
- Context API for state management
- React Query for data fetching
- Formik for forms
- Yup for validation
- Recharts for data visualization
- Lucide icons

## Project Structure

```
src/
├── components/      # Reusable UI components
├── contexts/        # React Context providers
├── hooks/           # Custom hooks
├── pages/           # Application screens
├── services/        # API services
├── tests/           # Unit tests
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── App.tsx          # Application entry point
└── index.css        # Global styles
```

## Getting Started

### Prerequisites

- Node.js 16 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/sellmaster-mobile.git
cd sellmaster-mobile
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a .env file in the root directory and add your environment variables
```
REACT_APP_API_URL=https://api.sellmaster.example.com
REACT_APP_SECRET_KEY=your-secret-key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Build for production
```bash
npm run build
# or
yarn build
```

## Testing

Run unit tests with:
```bash
npm test
# or
yarn test
```

The project includes example tests for the payment math parser functionality.

## Screenshots

[Include screenshots here]

## Future Enhancements

- Push notifications for payment reminders
- Extended data visualization with more chart types
- Full offline sync conflict resolution
- Enhanced biometric authentication implementation
- Export/import data functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.
