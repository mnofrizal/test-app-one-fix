# React Native Mobile App

A modern React Native application with a scalable architecture, navigation system, and state management.

## 🚀 Features

- Bottom tab navigation
- Global state management with Zustand
- Styling with NativeWind (Tailwind CSS)
- Bottom sheet integration with @gorhom/bottom-sheet
- Custom theming system
- Organized folder structure

## 📁 Project Structure

```
src/
├── api/          # API integration and services
├── components/   # Reusable components
├── navigation/   # Navigation configuration
├── screens/      # Screen components
├── store/        # State management
├── theme/        # Theme configuration
├── utils/        # Utility functions
└── hooks/        # Custom hooks
```

## 🛠 Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## 📱 Running the App

- Press 'a' to run on Android emulator
- Press 'i' to run on iOS simulator
- Scan QR code with Expo Go app on your device

## 🏗 Project Configuration

The project uses the following key dependencies:

- Navigation: @react-navigation/native
- State Management: zustand
- API Handling: axios
- Styling: nativewind (v2.0.11)
- Bottom Sheet: @gorhom/bottom-sheet (v4.6.3)

## 🔧 Best Practices

### Component Structure

- Keep components focused and single-responsibility
- Use hooks for complex logic and state management
- Implement proper error handling and loading states

### State Management

- Use Zustand for global state
- Keep state minimal and focused
- Implement proper actions and selectors

### Performance

- Implement proper memo and callback usage
- Avoid unnecessary re-renders
- Use proper list optimization (e.g., FlatList)

### Styling

- Use NativeWind classes for styling
- Follow consistent naming conventions
- Keep styles modular and reusable

## 🔎 Code Examples

### Using Global State

```javascript
import useStore from "../store/useStore";

const Component = () => {
  const { requestSummary, updateRequestCount } = useStore();
  // Use state and actions
};
```

### Navigation

```javascript
import { useNavigation } from "@react-navigation/native";

const Component = () => {
  const navigation = useNavigation();
  // Navigate: navigation.navigate('ScreenName');
};
```

### Theme Usage

```javascript
import { colors, spacing } from "../theme/theme";

// Use in styles or components
const styles = {
  container: {
    backgroundColor: colors.primary,
    padding: spacing.md,
  },
};
```

## 📝 Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
