// components/CountUpText.js
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function CountUpText({ value = 0, style, duration = 800, suffix = '' }) {
  const animated = useSharedValue(0);

  useEffect(() => {
    animated.value = withTiming(value, { duration, easing: Easing.out(Easing.cubic) });
  }, [value]);

  const props = useAnimatedProps(() => ({
    text: `${Math.round(animated.value)}${suffix}`,
    defaultValue: `${Math.round(animated.value)}${suffix}`,
  }));

  return <AnimatedText style={style} animatedProps={props}>{`${Math.round(value)}${suffix}`}</AnimatedText>;
}