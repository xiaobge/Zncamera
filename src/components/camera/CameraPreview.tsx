import type {RefObject} from 'react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Camera, type CameraDevice} from 'react-native-vision-camera';
import type {FramePayload} from '../../types/camera';

type CameraPreviewProps = {
  cameraRef: RefObject<Camera | null>;
  device: CameraDevice;
  onFrameCapture: (frame: FramePayload) => void;
};

export function CameraPreview({
  cameraRef,
  device,
  onFrameCapture,
}: CameraPreviewProps) {
  return (
    <Camera
      ref={cameraRef}
      style={styles.camera}
      device={device}
      isActive={true}
      photo={true}
      video={true}
      audio={true}
      enableZoomGesture={true}
      onFrameProcessed={onFrameCapture}
    />
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});
