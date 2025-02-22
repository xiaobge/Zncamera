/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, Platform, Linking } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';

export default function App() {
  // 相机引用
  const camera = useRef<Camera>(null);
  // 后置摄像头
  const device = useCameraDevice('back');
  // 权限状态
  const [hasPermission, setHasPermission] = useState(false);
  // 录制状态
  const [isRecording, setIsRecording] = useState(false);

  // 检查权限状态
  const checkPermissions = async () => {
    try {
      // 检查相机权限
      let cameraStatus = await Camera.getCameraPermissionStatus();
      if (cameraStatus !== 'granted') {
        cameraStatus = await Camera.requestCameraPermission();
      }

      // 检查麦克风权限
      let microphoneStatus = await Camera.getMicrophonePermissionStatus();
      if (microphoneStatus !== 'granted') {
        microphoneStatus = await Camera.requestMicrophonePermission();
      }

      // 设置权限状态
      const hasAllPermissions = (
        cameraStatus === 'granted' && 
        microphoneStatus === 'granted'
      );

      console.log('权限状态:', {
        camera: cameraStatus,
        microphone: microphoneStatus,
        hasAll: hasAllPermissions
      });

      setHasPermission(hasAllPermissions);
    } catch (error) {
      console.error('权限检查错误:', error);
      setHasPermission(false);
    }
  };

  // 在组件挂载时检查权限
  useEffect(() => {
    checkPermissions();
  }, []);

  // 添加打开设置的功能
  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('打开设置失败:', error);
    }
  };

  // 修改拍照功能
  const takePhoto = async () => {
    try {
      const photo = await camera.current?.takePhoto({
        qualityPrioritization: 'quality',
        flash: 'auto',
        enableAutoRedEyeReduction: true,
      });
      
      if (photo?.path) {
        // 获取相册目录
        const galleryPath = `${RNFS.PicturesDirectoryPath}/Camera`;
        
        // 确保目录存在
        await RNFS.mkdir(galleryPath);
        
        // 生成目标文件名
        const fileName = `IMG_${new Date().getTime()}.jpg`;
        const destPath = `${galleryPath}/${fileName}`;
        
        // 复制文件到相册
        await RNFS.copyFile(photo.path, destPath);
        
        // 通知媒体扫描器更新相册
        await RNFS.scanFile(destPath);
        
        Alert.alert('成功', '照片已保存到相册');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('错误', '保存照片失败');
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
        <Text style={styles.permissionText}>
          需要以下权限才能使用相机功能：{'\n\n'}
          • 相机权限 - 用于拍照和录像{'\n'}
          • 麦克风权限 - 用于录制声音{'\n'}
          • 存储权限 - 用于保存照片和视频到相册{'\n\n'}
          请在设置中开启这些权限
        </Text>
        <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
          <Text style={styles.settingsButtonText}>打开设置</Text>
        </TouchableOpacity>
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
        onFrameProcessed={onFrameCapture}
      />
      
      {/* 添加红圈 */}
      <View style={styles.redCircle} />

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
  // 添加红圈样式
  redCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'red',
    top: '50%',
    left: '50%',
    marginTop: -50,  // 负的高度的一半
    marginLeft: -50, // 负的宽度的一半
  },
  permissionText: {
    padding: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  settingsButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 40,
  },
  settingsButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
