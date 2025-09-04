import React, { useState } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';

interface CustomSwitchProps {
  onToggle: (isActive: boolean) => void;
  isActive: boolean;
  trackWidth?: number;
  trackHeight?: number;
  thumbSize?: number;
  trackColorActive?: string;
  trackColorInactive?: string;
  thumbColor?: string;
  trackBorderRadius?: number;
  thumbBorderRadius?: number;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  onToggle,
  isActive,
  trackWidth = 60,
  trackHeight = 30,
  thumbSize = 25,
  trackColorActive = '#4cd137',
  trackColorInactive = '#ccc',
  thumbColor = 'white',
  trackBorderRadius = 15,
  thumbBorderRadius = 12.5,
}) => {
  const animatedValue = useState(new Animated.Value(isActive ? 1 : 0))[0];

  const toggleSwitch = () => {
    onToggle(!isActive);
    Animated.timing(animatedValue, {
      toValue: !isActive ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, trackWidth - thumbSize - 2],
  });

  return (
    <TouchableOpacity onPress={toggleSwitch} activeOpacity={1}>
      <View
        style={[
          styles.track,
          {
            width: trackWidth,
            height: trackHeight,
            borderRadius: trackBorderRadius,
            backgroundColor: isActive ? trackColorActive : trackColorInactive,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbBorderRadius,
              backgroundColor: thumbColor,
              transform: [{ translateX: thumbPosition }],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  thumb: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default CustomSwitch;