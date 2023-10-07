import { useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  SlideInDown,
  SlideOutDown,
  withTiming,
} from "react-native-reanimated";
import type { Props } from "./loading.props";

const DEFAULT_TRANSLATE_Y = 48;

function LoginLoading(props: Props) {
  const { error, success, ...rest } = props;

  const translateY = useSharedValue(DEFAULT_TRANSLATE_Y);
  const loadingOpacity = useSharedValue(1);
  const opacity = useSharedValue(0);

  const showFeedbackMessage = useMemo(() => success || error, [error, success]);

  useEffect(() => {
    if (!showFeedbackMessage) {
      return;
    }

    translateY.value = withTiming(0, {
      duration: 250,
    });
    loadingOpacity.value = withSpring(0.24);
    opacity.value = withSpring(1);

    return () => {
      translateY.value = DEFAULT_TRANSLATE_Y;
      loadingOpacity.value = 1;
      opacity.value = 0;
    };
  }, [showFeedbackMessage]);

  const feedbackMessage = success
    ? "Authenticated with success!"
    : "Username or password are incorrect!";

  return (
    <Animated.View
      {...rest}
      entering={SlideInDown}
      exiting={SlideOutDown}
      style={[s.container, { transform: [{ translateY }] }, props.style]}
    >
      <Animated.Text style={[s.text, { opacity: loadingOpacity }]}>
        Authenticating...
      </Animated.Text>
      {showFeedbackMessage && (
        <Animated.Text
          style={[
            s.text,
            { opacity: opacity },
            error && s.error,
            success && s.success,
          ]}
        >
          {feedbackMessage}
        </Animated.Text>
      )}
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 32,
    gap: 28,
    backgroundColor: "#F1F1F1",
  },
  text: {
    fontSize: 28,
    lineHeight: 32,
    color: "#030712",
    fontWeight: "600",
  },
  error: {
    color: "#DC2626",
  },
  success: {
    color: "#16A34A",
  },
});

export default LoginLoading;
