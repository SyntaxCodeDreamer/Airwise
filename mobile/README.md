# AirWise AI Mobile App & APK Build Guide

This directory houses the React Native & Expo mobile application for **AirWise AI**.

## 📱 Architecture & Features
- **Live CPCB NAQI Tracking**: Real-time AQI gauge with PM2.5, PM10, NO2, SO2, CO, and O3.
- **Expo Location Integration**: Automatic GPS position fetching with background reverse geocoding to Indian cities.
- **GenAI Advisory Module**: Location & health-tailored advice (vulnerable groups, masks, HEPA filtration).
- **Incident Reporting**: Mobile-optimized local pollution alerts.

---

## 🛠️ Step-by-Step: How to Generate the Android APK

Expo applications use **EAS (Expo Application Services)** or **Local Android Prebuild** to generate production `.apk` files.

### Option 1: Cloud Build with EAS (Recommended & Easiest)
1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```
2. **Log in or create a free Expo account**:
   ```bash
   eas login
   ```
3. **Configure the project**:
   ```bash
   eas build:configure
   ```
4. **Trigger Direct APK Build (Installable on any Android device without Google Play)**:
   ```bash
   eas build --platform android --profile preview
   ```
   *EAS will build the standalone `.apk` on Expo cloud servers and provide a direct download link and QR code to install directly on your phone.*

---

### Option 2: Local APK Generation (Using Android Studio / Gradle)
If you have **Android Studio** and **Android SDK** installed locally on your machine:

1. **Prebuild Native Android Project**:
   ```bash
   npx expo prebuild --platform android
   ```
   *This ejects native Android source files into an `android/` directory.*

2. **Build Debug APK via Gradle**:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
3. **Locate your APK file**:
   ```
   mobile/android/app/build/outputs/apk/debug/app-debug.apk
   ```

---

### Option 3: Immediate Testing via Expo Go App (No APK Build needed)
1. Install **Expo Go** from Google Play Store on your Android phone.
2. In the terminal:
   ```bash
   cd mobile
   npx expo start
   ```
3. Scan the generated QR code in your terminal with Expo Go to run the full app live with real-time reload.
