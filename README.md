# Prerequisites & Setup

Step-by-step guide to set up the development environment for the React Native project (Android and Web only).

## System Requirements

- Operating system: Windows 10+, macOS 12+, or Linux (Ubuntu 20.04+)
- Minimum 8 GB of RAM (16 GB recommended)
- At least 20 GB of free disk space

## 1. Install Node.js (v18+)

Download the installer from https://nodejs.org/ (LTS version 18 or higher) and follow the installation wizard.

### Verify installation

```bash
node --version   # Should display v18.x.x or higher
npm --version    # Should display 9.x.x or higher
```

## 2. Install Expo (ONLY supported option)

This project uses Expo and it is the only supported development option.

```bash
npm install -g expo-cli
```

Verify installation:

```bash
expo --version
```

## 3. Set Up Android Studio and Emulator

Required only to run the app on Android.

1. Download and install https://developer.android.com/studio
2. During installation, make sure to check:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)
3. Open Android Studio → More Actions → SDK Manager
4. In SDK Platforms, install:
   - Android 14 (API 34) or the latest version
5. In SDK Tools, verify the following are installed:
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools
6. Set up environment variables (`~/.bashrc`, `~/.zshrc`, or equivalent):

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

7. Create an emulator:
   - Android Studio → More Actions → Virtual Device Manager
   - Create Device
   - Select a device (e.g., Pixel 7)
   - Select system image (API 34)
   - Finish and run

### Verify the emulator

```bash
adb devices   # Should show the emulator in the list
```

## 4. Install VSCode Extensions

Install Visual Studio Code and add the following:

| Extension | ID | Description |
|---|---|---|
| ESLint | `dbaeumer.vscode-eslint` | JavaScript/TypeScript linter |
| Prettier | `esbenp.prettier-vscode` | Code formatter |
| React Native Tools | `msjsdiag.vscode-react-native` | Debugging tools |

Install via terminal:

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension msjsdiag.vscode-react-native
```

## 5. Clone and Install the Project

```bash
# Clone the repository
git clone https://github.com/montanocano/PokeApiPokedex
cd PokeApiPokedex

# Install dependencies
npm install
```

## 6. Install Additional Libraries

### Tamagui (UI Framework)

```bash
npx expo install tamagui @tamagui/config

### Zustand (State Management)

```bash
npx expo install zustand
```

### Axios (HTTP Client)

```bash
npx expo install axios
```

## 7. Start the Project (Android and Web)

```bash
npx expo start
```

Once started:

- Press **a** → Run on Android emulator
- Press **w** → Run in browser (Web)