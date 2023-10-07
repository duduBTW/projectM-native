import { LoginRequestBody } from "@/app/auth/data/login";
import { View } from "react-native";

export type Props = {
  onSubmit: (data: LoginRequestBody) => void;
  isError?: boolean;
} & React.ComponentProps<typeof View>;
