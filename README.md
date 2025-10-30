# Pesa-Track Frontend

A modern React Native Expo mobile application for comprehensive M-Pesa and mobile money transaction management, built to work seamlessly with the Pesa-Tracker Backend API.

## 👥 Team Members

- **Jayden Kamau**
- **Lincoln Ngugi** 
- **Jerry Omweno**
- **Natasha Karwitha**
- **Paul Kimani**

## 🚀 Project Overview

Pesa-Track Frontend is a cross-platform mobile application that provides users with an intuitive interface to track, manage, and analyze their mobile money transactions. Built with React Native and Expo, it offers a seamless experience across iOS, Android, and web platforms.

## 🏗️ Architecture

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6 (Stack & Bottom Tab)
- **Platform Support**: iOS, Android, Web
- **Backend Integration**: RESTful API communication
- **UI Components**: Native components with Ionicons

## 📁 Project Structure

```
Pesa-Track-Frontend/
├── assets/                    # App icons and splash screens
│   ├── adaptive-icon.png     # Android adaptive icon
│   ├── favicon.png           # Web favicon
│   ├── icon.png              # App icon
│   └── splash-icon.png       # Splash screen image
├── src/
│   ├── screens/              # Authentication screens
│   │   ├── HomeScreen.jsx    # Welcome/landing screen
│   │   ├── LoginScreen.jsx   # User login
│   │   └── SignUpScreen.jsx  # User registration
│   └── tabs/                 # Main app tab screens
│       ├── AnalysisScreen.jsx    # Transaction analytics
│       ├── Contact.jsx           # Contact management
│       ├── ContactDetails.jsx    # Individual contact view
│       ├── DashboardScreen.jsx   # Main dashboard
│       ├── ProfileScreen.jsx     # User profile
│       ├── SettingScreen.jsx     # App settings
│       └── TransactionsScreen.jsx # Transaction history
├── App.js                    # Main app component with navigation
├── app.json                  # Expo configuration
├── index.js                  # App entry point
└── package.json              # Dependencies and scripts
```

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tools
- **React Navigation** - Navigation library
- **Ionicons** - Icon library
- **React Native Safe Area Context** - Safe area handling

## 📱 Features

### Authentication Flow
- **Welcome Screen** - App introduction and navigation
- **User Registration** - Account creation with validation
- **User Login** - Secure authentication
- **Profile Management** - User profile viewing and editing

### Main Application (Tab Navigation)
- **Dashboard** - Transaction overview and quick actions
- **Contact Management** - Add, view, and manage contacts
- **Transaction History** - Comprehensive transaction tracking
- **Analytics** - Visual transaction analysis and insights
- **Profile** - User account management and settings

### Navigation Structure
- **Stack Navigation** - Authentication and detail screens
- **Bottom Tab Navigation** - Main app functionality
- **Nested Navigation** - Seamless screen transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Pesa-Track-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Expo CLI (if not already installed)**
   ```bash
   npm install -g @expo/cli
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

### Running on Different Platforms

- **iOS Simulator**: `npm run ios` or press `i` in the terminal
- **Android Emulator**: `npm run android` or press `a` in the terminal
- **Web Browser**: `npm run web` or press `w` in the terminal

## 📡 Backend Integration

This frontend connects to the **Pesa-Tracker Backend API** which provides:

- **User Authentication** - Registration and login endpoints
- **Transaction Management** - Save and retrieve transaction data
- **Contact Management** - CRUD operations for user contacts
- **Data Persistence** - PostgreSQL database storage

**Backend Repository**: `https://github.com/Natasha-01-design/Pesa-Tracker-App.git`

## 🎨 UI/UX Features

- **Bottom Tab Navigation** with Ionicons
- **Safe Area Handling** for different device screens
- **Responsive Design** across iOS, Android, and web
- **Modern UI Components** with consistent styling
- **Intuitive Navigation Flow** between screens

## 📱 Screen Descriptions

### Authentication Screens
- **HomeScreen**: Welcome screen with app introduction
- **LoginScreen**: User authentication with form validation
- **SignUpScreen**: New user registration

### Main App Tabs
- **DashboardScreen**: Overview of recent transactions and quick actions
- **ContactScreen**: List and manage user contacts
- **TransactionsScreen**: Complete transaction history with filtering
- **AnalysisScreen**: Visual analytics and spending insights
- **ProfileScreen**: User profile management and account settings

### Additional Screens
- **ContactDetails**: Detailed view of individual contacts
- **SettingsScreen**: App configuration and preferences

## 🔧 Configuration

### Expo Configuration (`app.json`)
- **App Name**: Pesa-Track-Frontend
- **Version**: 1.0.0
- **Orientation**: Portrait
- **Platform Support**: iOS, Android, Web
- **New Architecture**: Enabled for React Native

### Navigation Setup
- Stack Navigator for authentication flow
- Bottom Tab Navigator for main app functionality
- Custom tab bar styling with safe area support

## 🚀 Deployment

### Development
```bash
expo start --dev-client
```

### Production Build
```bash
# For Android
expo build:android

# For iOS
expo build:ios

# For Web
expo build:web
```

### Expo Application Services (EAS)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure and build
eas build --platform all
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is part of Moringa School curriculum and is intended for educational purposes.

## 📞 Support

For questions or support, please contact any of the team members listed above or engage Moringa school management.

---

**Note**: This is the frontend React Native application for Pesa-Tracker. For the backend API, please refer to the backend repository at `https://github.com/Natasha-01-design/Pesa-Tracker-App.git`.