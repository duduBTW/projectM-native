import { StyleSheet, Pressable, Text } from "react-native";
import { Props } from "./button.props";

function Button(props: Props) {
  const { children, ...rest } = props;

  return (
    <Pressable {...rest} style={[styles.button]}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5F7DE2",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  text: {
    height: 14,
    fontSize: 16,
    lineHeight: 16,
    fontWeight: "500",
    color: "white",
    padding: 0,
    margin: 0,
  },
});

export default Button;
