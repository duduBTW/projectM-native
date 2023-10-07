import { FlingGesture, PanGesture } from "react-native-gesture-handler";

export type Props = {
  url: string;
  gesture: PanGesture;
  onPinchStart: () => void;
  onPinchEnd: () => void;
  onSlideNext: () => void;
  onSlidePrevious: () => void;
  onMiddleTap: () => void;
};
