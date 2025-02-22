/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

export default function App() {
  // 相机引用
  const camera = useRef<Camera>(null);
  // 后置摄像头
  const device = useCameraDevice('back');
  // 权限状态
  const [hasPermission, setHasPermission] = useState(false);
  // 录制状态
  const [isRecording, setIsRecording] = useState(false);

  // 请求权限
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      const microphonePermission = await Camera.requestMicrophonePermission();
      setHasPermission(
        cameraPermission === 'granted' && microphonePermission === 'granted'
      );
    })();
  }, []);

  // 拍照功能
  const takePhoto = async () => {
    try {
      const photo = await camera.current?.takePhoto({
        qualityPrioritization: 'quality',
        flash: 'auto',
        enableAutoRedEyeReduction: true,
      });
      Alert.alert('成功', `照片已保存到: ${photo?.path}`);
    } catch (e) {
      Alert.alert('错误', '拍照失败');
    }
  };

  // 录像功能
  const toggleRecording = async () => {
    if (isRecording) {
      await camera.current?.stopRecording();
    } else {
      try {
        await camera.current?.startRecording({
          onRecordingFinished: (video) => {
            Alert.alert('成功', `视频已保存到: ${video.path}`);
            setIsRecording(false);
          },
          onRecordingError: (error) => {
            Alert.alert('错误', '录制失败');
            setIsRecording(false);
          },
        });
        setIsRecording(true);
      } catch (e) {
        Alert.alert('错误', '无法开始录制');
      }
    }
  };

  // 添加视频帧回调
  const onFrameCapture = (frame: any) => {
    try {
      // 这里可以处理视频帧数据
      console.log('收到视频帧:', {
        width: frame.width,
        height: frame.height,
        timestamp: frame.timestamp
      });
    } catch (error) {
      console.error('处理视频帧出错:', error);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>需要相机和麦克风权限</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.container}>
        <Text>找不到相机设备</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
        video={true}
        audio={true}
        enableZoomGesture={true}
        onFrameProcessed={onFrameCapture}  // 添加帧处理回调
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>拍照</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, isRecording && styles.recordingButton]} 
          onPress={toggleRecording}
        >
          <Text style={styles.buttonText}>
            {isRecording ? '停止录制' : '开始录制'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
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
