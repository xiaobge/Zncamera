/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-vision-camera', () => {
  const React = require('react');
  const {View} = require('react-native');
  const MockCamera = React.forwardRef(() => <View />);

  MockCamera.requestCameraPermission = jest.fn(async () => 'granted');
  MockCamera.requestMicrophonePermission = jest.fn(async () => 'granted');

  return {
    Camera: MockCamera,
    useCameraDevice: jest.fn(() => ({id: 'mock-device', position: 'back'})),
  };
});

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
