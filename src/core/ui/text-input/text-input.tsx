import { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput as TextInputNative,
} from "react-native";
import { Props } from "./text-input.props";

const TextInput = forwardRef(
  (props: Props, ref: React.Ref<TextInputNative>) => {
    const { label, inputProps, error, message, ...rest } = props;

    return (
      <View
        {...rest}
        style={[styles.container, error && styles.error, rest.style]}
      >
        <View style={styles.row}>
          {label && (
            <Text style={[styles.label, error && styles.error]}>{label}</Text>
          )}
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
        <TextInputNative
          {...inputProps}
          ref={ref}
          style={[styles.input, inputProps?.style]}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  row: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "baseline",
    padding: 12,
    paddingBottom: 0,
  },
  label: {
    fontSize: 14,
    lineHeight: 14,
    color: "#4B5563",
  },
  message: {
    fontSize: 12,
    lineHeight: 14,
    color: "#EF4444",
  },
  input: {
    fontSize: 16,
    lineHeight: 16,
    color: "#111827",
    padding: 12,
    paddingTop: 8,
  },
  error: {
    color: "#991B1B",
    backgroundColor: "#FEF2F2",
  },
});

export default TextInput;
