import Icon from "react-native-remix-icon";
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  ZoomInRotate,
} from "react-native-reanimated";

function CircularProgressIndicator() {
  const rotation = useSharedValue(0);
  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotation.value}deg`,
      },
    ],
  }));

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
      }),
      Infinity
    );
  }, []);

  return (
    <Animated.View entering={ZoomInRotate} style={containerStyle}>
      <Icon name="loader-3-fill" size="20" color="#5F7DE2" />
    </Animated.View>
  );
}

export default CircularProgressIndicator;
