import React from 'react';
import { TouchableOpacity } from 'react-native';

const CustomTabButton = ({ children, onPress, accessibilityState = {} }) => {
  const { selected: focused } = accessibilityState;

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: focused ? 'purple' : '#f5f5f5',
        borderRadius: 10,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

export default CustomTabButton;
