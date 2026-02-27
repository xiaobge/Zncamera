import type {RefObject} from 'react';
import {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import type {Camera} from 'react-native-vision-camera';
import {MESSAGES} from '../../constants/messages';
import {
  startVideoRecording,
  stopVideoRecording,
} from '../../services/camera/captureService';

export function useVideoRecorder(cameraRef: RefObject<Camera | null>) {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      await stopVideoRecording(cameraRef.current);
      return;
    }

    try {
      startVideoRecording(cameraRef.current, {
        onRecordingFinished: video => {
          Alert.alert(MESSAGES.successTitle, MESSAGES.videoSaved(video.path));
          setIsRecording(false);
        },
        onRecordingError: () => {
          Alert.alert(MESSAGES.errorTitle, MESSAGES.recordingFailed);
          setIsRecording(false);
        },
      });
      setIsRecording(true);
    } catch {
      Alert.alert(MESSAGES.errorTitle, MESSAGES.recordingStartFailed);
    }
  }, [cameraRef, isRecording]);

  return {isRecording, toggleRecording};
}
