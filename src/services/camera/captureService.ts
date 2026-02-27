import type {Camera} from 'react-native-vision-camera';

type RecordingCallbacks = {
  onRecordingFinished: (video: {path: string}) => void;
  onRecordingError: (error: unknown) => void;
};

export async function capturePhoto(camera: Camera | null) {
  if (camera == null) {
    throw new Error('Camera is not ready');
  }

  return camera.takePhoto({
    qualityPrioritization: 'quality',
    flash: 'auto',
    enableAutoRedEyeReduction: true,
  });
}

export function startVideoRecording(
  camera: Camera | null,
  callbacks: RecordingCallbacks,
): void {
  if (camera == null) {
    throw new Error('Camera is not ready');
  }

  camera.startRecording(callbacks);
}

export async function stopVideoRecording(camera: Camera | null): Promise<void> {
  if (camera == null) {
    return;
  }

  await camera.stopRecording();
}
