import { blueColorCustomization, grayColorCustomization } from "./color";
import { sizeCustomization } from "./size";
import bordersCustomization from "./border";
import {
  fontNunito,
  fontPoppins,
  fontSizeCustomization,
  lineHeightCustomization,
} from "./typography";

const theme = {
  border: bordersCustomization,
  color: {
    white: "#fff",
    brand: {
      main: "#5F7DE2",
    },
    gray: grayColorCustomization,
    blue: blueColorCustomization,
  },
  size: sizeCustomization,
  font: {
    size: fontSizeCustomization,
    height: lineHeightCustomization,
    poppins: fontPoppins,
    nunito: fontNunito,
  },
};

export default theme;
