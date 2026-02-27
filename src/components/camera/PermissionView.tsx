import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type PermissionViewProps = {
  message: string;
};

export function PermissionView({message}: PermissionViewProps) {
  return (
    <View style={styles.container}>
      <Text>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
