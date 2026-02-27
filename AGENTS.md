# Zncamera

React Native camera app (宅男拍照神器) using `react-native-vision-camera`.

## Cursor Cloud specific instructions

### Project overview

Single React Native mobile app (no backend, no database, no monorepo). Android-only builds are possible on this Linux VM; iOS requires macOS.

### Available npm scripts

See `package.json` for the canonical list: `lint`, `test`, `start`, `android`, `ios`.

### Lint

```
npm run lint
```

Pre-existing lint errors exist in `App.tsx` (unused variable, trailing spaces). These are not caused by cloud agent changes.

### Tests

```
npm test
```

The single test (`__tests__/App.test.tsx`) fails with `system/camera-module-not-found` because `react-native-vision-camera` native module is not linked in the Jest environment. A Jest mock for the native module would be needed to make it pass. This is a pre-existing issue.

### Android build

```
cd android && ANDROID_HOME=/opt/android-sdk ./gradlew assembleDebug --no-daemon
```

- Requires Android SDK at `/opt/android-sdk` with platform 35, build-tools 35.0.0, and NDK 27.1.12297006.
- `gradlew` needs `chmod +x` on first checkout.
- Java 21 (system default) works fine with Gradle 8.12.
- Debug APK is output to `android/app/build/outputs/apk/debug/app-debug.apk`.

### Metro bundler (dev server)

```
npx react-native start --port 8081
```

Verify with `curl http://localhost:8081/status` (should return `packager-status:running`).

### Gotchas

- No Android emulator is available on the cloud VM, so you cannot run the app interactively. You can build the APK and test the Metro bundler.
- `ANDROID_HOME=/opt/android-sdk` is set in `~/.bashrc`. If a new shell does not pick it up, export it manually.
- The `gradlew` script may lose its execute bit after fresh checkout — run `chmod +x android/gradlew` if needed.
