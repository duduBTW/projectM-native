import { TextInput, View } from "react-native";

export type Props = {
  label?: string;
  message?: string;
  error?: boolean;
  inputProps?: React.ComponentProps<typeof TextInput>;
} & React.ComponentProps<typeof View>;
