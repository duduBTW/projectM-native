import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import TextInput from "@/core/ui/text-input";
import Button from "@/core/ui/button/button";
import { LoginRequestBody } from "@/app/auth/data/login";
import { Props } from "./form.props";

function LoginForm(props: Props) {
  const { onSubmit, isError, ...rest } = props;
  const { handleSubmit, control } = useForm<LoginRequestBody>();
  const passwordRef = useRef<any>(null);

  return (
    <View {...rest} style={[s.container, rest.style]}>
      <Text style={s.title}>Login</Text>

      <View style={s.inputColumn}>
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: "Username is required!",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextInput
              inputProps={{
                ...field,
                onChangeText: field.onChange,
                autoFocus: true,
                keyboardType: "email-address",
                returnKeyType: "next",
                autoCapitalize: "none",
                onSubmitEditing: () => {
                  passwordRef.current.focus();
                },
              }}
              label="Username"
              message={error?.message}
              error={Boolean(error)}
            />
          )}
          name="username"
        />

        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: "Password is required!",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextInput
              inputProps={{
                ...field,
                onChangeText: field.onChange,
                secureTextEntry: true,
                autoCapitalize: "none",
                onSubmitEditing: handleSubmit(onSubmit),
              }}
              label="Password"
              message={error?.message}
              error={Boolean(error)}
              ref={passwordRef}
            />
          )}
          name="password"
        />

        {isError && (
          <View style={s.warningContainer}>
            <Text style={s.warningText}>
              Username or password are incorrect!
            </Text>
          </View>
        )}
      </View>

      <Button onPress={handleSubmit(onSubmit)}>Enter</Button>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    margin: 20,
    marginTop: 32,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    color: "#111827",
  },
  inputColumn: {
    gap: 12,
  },
  warningContainer: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  warningText: {
    color: "#EF4444",
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default LoginForm;
