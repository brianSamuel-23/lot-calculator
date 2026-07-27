# Forex Calculator

An Expo (React Native) app built with Expo SDK 57.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes with Node)
- The [Expo Go](https://expo.dev/go) app on your phone (for testing on a physical device), and/or:
  - Xcode + iOS Simulator (for iOS, macOS only)
  - Android Studio + an Android emulator (for Android)

## Setup

Install dependencies:

```bash
npm install
```

## Running the app

Start the Expo dev server:

```bash
npm start
```

This opens Metro Bundler in your terminal and a QR code. Scan it with the Expo Go app (Android) or the Camera app (iOS) to run the app on your physical device.

Alternatively, run directly on a specific platform:

```bash
npm run ios      # opens in the iOS Simulator (macOS only)
npm run android  # opens in an Android emulator/device
npm run web      # opens in your web browser
```

## Notes

- This project targets Expo SDK 57. Refer to the versioned docs at https://docs.expo.dev/versions/v57.0.0/ if you run into API differences from older Expo tutorials/guides.
- Entry point: [index.ts](index.ts) → [App.tsx](App.tsx).
