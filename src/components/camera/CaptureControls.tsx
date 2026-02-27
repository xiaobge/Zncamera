import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type CaptureControlsProps = {
  isRecording: boolean;
  onTakePhoto: () => void;
  onToggleRecording: () => void;
};

export function CaptureControls({
  isRecording,
  onTakePhoto,
  onToggleRecording,
}: CaptureControlsProps) {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onTakePhoto}>
        <Text style={styles.buttonText}>拍照</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, isRecording && styles.recordingButton]}
        onPress={onToggleRecording}>
        <Text style={styles.buttonText}>
          {isRecording ? '停止录制' : '开始录制'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    opacity: 0.7,
  },
  recordingButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
});
