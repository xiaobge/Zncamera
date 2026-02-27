import React, {useCallback, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {CameraPreview} from '../components/camera/CameraPreview';
import {CaptureControls} from '../components/camera/CaptureControls';
import {PermissionView} from '../components/camera/PermissionView';
import {MESSAGES} from '../constants/messages';
import {useCameraPermission} from '../hooks/camera/useCameraPermission';
import {usePhotoCapture} from '../hooks/camera/usePhotoCapture';
import {useVideoRecorder} from '../hooks/camera/useVideoRecorder';
import type {FramePayload} from '../types/camera';

export function CameraScreen() {
  const camera = useRef<Camera | null>(null);
  const device = useCameraDevice('back');
  const hasPermission = useCameraPermission();
  const {takePhoto} = usePhotoCapture(camera);
  const {isRecording, toggleRecording} = useVideoRecorder(camera);

  const onFrameCapture = useCallback((frame: FramePayload) => {
    try {
      // 预留帧处理扩展点（例如滤镜、AI 分析）
      console.log('收到视频帧:', {
        width: frame.width,
        height: frame.height,
        timestamp: frame.timestamp,
      });
    } catch (error) {
      console.error('处理视频帧出错:', error);
    }
  }, []);

  if (!hasPermission) {
    return <PermissionView message={MESSAGES.permissionRequired} />;
  }

  if (device == null) {
    return <PermissionView message={MESSAGES.noCameraDevice} />;
  }

  return (
    <View style={styles.container}>
      <CameraPreview
        cameraRef={camera}
        device={device}
        onFrameCapture={onFrameCapture}
      />
      <CaptureControls
        isRecording={isRecording}
        onTakePhoto={takePhoto}
        onToggleRecording={toggleRecording}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
