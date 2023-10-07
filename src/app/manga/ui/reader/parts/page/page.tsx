import { View, LayoutChangeEvent, Dimensions } from "react-native";
import { useMemo, useState } from "react";
import { Props } from "./page.props";
import Animated, {
  runOnJS,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

function Page(props: Props) {
  const {
    url,
    onPinchEnd,
    onPinchStart,
    onSlideNext,
    onSlidePrevious,
    onMiddleTap,
    gesture,
  } = props;
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const [center, setCenter] = useState({
    x: 0,
    y: 0,
  });
  const translate = { x: useSharedValue(0), y: useSharedValue(0) };
  const savedTranslate = { x: useSharedValue(0), y: useSharedValue(0) };
  const focal = { x: useSharedValue(0), y: useSharedValue(0) };
  const initialFocal = { x: useSharedValue(0), y: useSharedValue(0) };
  const deviceWidth = useMemo(() => Dimensions.get("window").width, []);

  const panGesture = Gesture.Pan()
    .simultaneousWithExternalGesture(gesture)
    .hitSlop({
      left: 0,
      right: 0,
    })
    .onStart(() => {
      savedTranslate.x.value = translate.x.value;
      savedTranslate.y.value = translate.y.value;
    })
    .onUpdate((event) => {
      if (scale.value <= 1) {
        return;
      }

      translate.x.value = savedTranslate.x.value + event.translationX;
      translate.y.value = savedTranslate.y.value + event.translationY;
    })
    .onEnd((event) => {
      if (scale.value <= 1) {
        return;
      }

      translate.x.value = withSpring(translate.x.value + event.velocityX / 10, {
        velocity: event.velocityX * 1.3,
        mass: 0.9,
        damping: 40,
        overshootClamping: true,
      });
      translate.y.value = withSpring(translate.y.value + event.velocityY / 10, {
        velocity: event.velocityY * 1.3,
        mass: 0.9,
        damping: 40,
        overshootClamping: true,
      });
    });

  const pinchGesture = Gesture.Pinch()
    .onStart((event) => {
      runOnJS(onPinchStart)();
      initialFocal.x.value = event.focalX;
      initialFocal.y.value = event.focalY;
    })
    .onUpdate((e) => {
      const newScaleValue = Math.min(
        Math.max(savedScale.value * e.scale, 1),
        2.4
      );

      scale.value = newScaleValue;
      focal.x.value = (center.x - initialFocal.x.value) * (scale.value - 1);
      focal.y.value = (center.y - initialFocal.y.value) * (scale.value - 1);
    })
    .onEnd(() => {
      savedScale.value = scale.value;

      if (scale.value === 1) {
        translate.x.value = withTiming(0);
        translate.y.value = withTiming(0);
        focal.x.value = withTiming(0);
        focal.y.value = withTiming(0);
        runOnJS(onPinchEnd)();
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .maxDuration(100)
    .numberOfTaps(2)
    .onStart((e) => {
      if (scale.value > 1) {
        runOnJS(onPinchEnd)();
        scale.value = withTiming(1);
        translate.x.value = withTiming(0);
        translate.y.value = withTiming(0);
        focal.x.value = withTiming(0);
        focal.y.value = withTiming(0);
        return;
      }

      runOnJS(onPinchStart)();
      scale.value = withTiming(1.6);
      focal.x.value = withTiming(center.x - e.absoluteX);
      focal.y.value = withTiming(center.y - e.absoluteY);
    });
  const tapTapGesture = Gesture.Tap()
    .maxDuration(100)
    .numberOfTaps(1)
    .onStart((event) => {
      const percTapPosition = event.absoluteX / deviceWidth;

      switch (true) {
        case percTapPosition > 0.7:
          runOnJS(onSlideNext)();
          break;
        case percTapPosition < 0.3:
          runOnJS(onSlidePrevious)();
          break;
        default:
          runOnJS(onMiddleTap)();
          break;
      }

      scale.value = withTiming(1);
      translate.x.value = withTiming(0);
      translate.y.value = withTiming(0);
      focal.x.value = withTiming(0);
      focal.y.value = withTiming(0);
    });

  const onLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;

    setCenter({
      x: x + width / 2,
      y: y + height / 2,
    });
  };

  const gestures = Gesture.Exclusive(
    Gesture.Simultaneous(pinchGesture, panGesture),
    Gesture.Exclusive(doubleTapGesture, tapTapGesture)
  );

  return (
    <GestureDetector gesture={gestures}>
      <View
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Animated.Image
          source={{
            uri: url,
          }}
          onLayout={onLayout}
          style={{
            flexGrow: 1,
            width: "100%",
            objectFit: "contain",
            transform: [
              { translateX: translate.x },
              { translateY: translate.y },
              { translateX: focal.x },
              { translateY: focal.y },
              {
                scale,
              },
            ],
          }}
        />
      </View>
    </GestureDetector>
  );
}

export default Page;
