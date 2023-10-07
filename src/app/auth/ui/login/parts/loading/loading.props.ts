import { View } from "react-native";

export type Props = React.ComponentProps<typeof View> & {
  error: boolean;
  success: boolean;
};
