import {Camera} from 'react-native-vision-camera';

export async function requestCameraAndMicrophonePermission(): Promise<boolean> {
  const [cameraPermission, microphonePermission] = await Promise.all([
    Camera.requestCameraPermission(),
    Camera.requestMicrophonePermission(),
  ]);

  return cameraPermission === 'granted' && microphonePermission === 'granted';
}
