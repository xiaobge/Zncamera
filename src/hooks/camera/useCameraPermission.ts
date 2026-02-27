import {useEffect, useState} from 'react';
import {requestCameraAndMicrophonePermission} from '../../services/camera/permissionService';

export function useCameraPermission(): boolean {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const requestPermission = async () => {
      try {
        const granted = await requestCameraAndMicrophonePermission();
        if (isMounted) {
          setHasPermission(granted);
        }
      } catch {
        if (isMounted) {
          setHasPermission(false);
        }
      }
    };

    requestPermission();

    return () => {
      isMounted = false;
    };
  }, []);

  return hasPermission;
}
