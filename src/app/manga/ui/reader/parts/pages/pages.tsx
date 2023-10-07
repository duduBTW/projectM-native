import { View, Dimensions } from "react-native";
import Page from "../page";
import { Props } from "./pages.props";
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { useMemo, useState } from "react";

function Pages(props: Props) {
  const { pages, ...rest } = props;

  const x = useSharedValue(0);
  const pageX = useSharedValue(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [enable, setEnable] = useState(true);

  const deviceWidth = useMemo(() => Dimensions.get("window").width, []);

  const disableStuff = () => {
    setEnable(false);
  };

  const enableStuff = () => {
    setEnable(true);
  };

  const panGesture = Gesture.Pan()
    .maxPointers(1)
    .minPointers(1)
    .enabled(enable)
    .onUpdate((e) => {
      x.value = e.translationX;
    })
    .onEnd((e) => {
      const velocity = Math.abs(e.velocityX) / 1000;
      const movedAmount = ((e.translationX * -1) / deviceWidth) * velocity;

      if (movedAmount > 0.2) {
        // console.log(pageX.value, deviceWidth * ((pages.length - 1) * -1));

        if (pageX.value > deviceWidth * ((pages.length - 1) * -1)) {
          pageX.value = withTiming(pageX.value - deviceWidth);
        }

        x.value = withTiming(0);
      } else if (movedAmount < -0.2) {
        // console.log(pageX.value);

        if (pageX.value < 0) {
          pageX.value = withTiming(pageX.value + deviceWidth);
        }
        x.value = withTiming(0);
      } else {
        x.value = withSpring(0);
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        {...rest}
        style={{
          flex: 1,
          flexDirection: "row",
          width: Dimensions.get("window").width * pages.length,
          // width: Dimensions.get("window").width,
          transform: [
            {
              // translateX: Dimensions.get("window").width * 1.5 * -1,
              translateX: pageX,
            },
            {
              translateX: x,
            },
          ],
        }}
      >
        <Page
          gesture={panGesture}
          onPinchStart={disableStuff}
          onPinchEnd={enableStuff}
          onSlideNext={() => {
            enableStuff();
            pageX.value = withTiming(pageX.value - deviceWidth);
          }}
          onSlidePrevious={() => {
            enableStuff();
            pageX.value = withTiming(pageX.value + deviceWidth);
          }}
          onMiddleTap={() => {
            //
          }}
          url={
            "https://pbs.twimg.com/media/F7lv5HAaAAANSvx?format=jpg&name=900x900"
          }
        />
        {/* {pages.map((page) => (
          <Page
            gesture={panGesture}
            onPinchStart={disableStuff}
            onPinchEnd={enableStuff}
            onSlideNext={() => {
              enableStuff();
              pageX.value = withTiming(pageX.value - deviceWidth);
            }}
            onSlidePrevious={() => {
              enableStuff();
              pageX.value = withTiming(pageX.value + deviceWidth);
            }}
            onMiddleTap={() => {
              //
            }}
            key={page}
            url={page}
          />
        ))} */}
      </Animated.View>
    </GestureDetector>
  );
}

export default Pages;
