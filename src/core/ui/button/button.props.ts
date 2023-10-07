import { Pressable, Text } from "react-native";

export type Props = Omit<React.ComponentProps<typeof Pressable>, "children"> &
  Pick<React.ComponentProps<typeof Text>, "children">;
