export const MESSAGES = {
  permissionRequired: '需要相机和麦克风权限',
  noCameraDevice: '找不到相机设备',
  successTitle: '成功',
  errorTitle: '错误',
  photoSaved: (path: string) => `照片已保存到: ${path}`,
  videoSaved: (path: string) => `视频已保存到: ${path}`,
  photoFailed: '拍照失败',
  recordingFailed: '录制失败',
  recordingStartFailed: '无法开始录制',
} as const;
