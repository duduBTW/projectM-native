import type { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { fontSizeCustomization } from "../theme/typography";

function sizingFactory<
  ConsumerKey extends string,
  AccessorKey extends keyof TextStyle,
  Values extends Record<string, any>
>(
  consumerKey: ConsumerKey,
  accessorKey: AccessorKey,
  values: Values
): Record<ConsumerKey, Record<keyof Values, any>> {}

const c = {
  ...sizingFactory("textSize", "fontSize", fontSizeCustomization),
  ...sizingFactory("p", "padding", sizeCustomization),
  ...sizingFactory("px", "paddingHorizontal", sizeCustomization),
  ...sizingFactory("py", "paddingHorizontal", sizeCustomization),
  ...sizingFactory("m", "margin", sizeCustomization),
  textColor: {
    ...sizingFactory("gray", "color", grayColorCustomization),
  },
} as const;

c.textColor.gray["200"];

export default c;
