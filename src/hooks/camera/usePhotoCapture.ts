import type {RefObject} from 'react';
import {useCallback} from 'react';
import {Alert} from 'react-native';
import type {Camera} from 'react-native-vision-camera';
import {MESSAGES} from '../../constants/messages';
import {capturePhoto} from '../../services/camera/captureService';

export function usePhotoCapture(cameraRef: RefObject<Camera | null>) {
  const takePhoto = useCallback(async () => {
    try {
      const photo = await capturePhoto(cameraRef.current);
      if (photo?.path) {
        Alert.alert(MESSAGES.successTitle, MESSAGES.photoSaved(photo.path));
      }
    } catch {
      Alert.alert(MESSAGES.errorTitle, MESSAGES.photoFailed);
    }
  }, [cameraRef]);

  return {takePhoto};
}
