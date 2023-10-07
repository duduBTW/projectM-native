import { useEffect, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/core/auth/auth-provider";
import { LoginReponse, LoginRequestBody, login } from "../../data/login";
import LoginLoading from "./parts/loading";
import LoginForm, { Props as LoginFormProps } from "./parts/form";

const SHOW_RESPONSE_MILISECONDS = 3000;

function LoginPage() {
  const { authenticate } = useAuth();
  const [showLoader, setShowLoader] = useState(false);
  const { mutate, data, isError, isSuccess } = useMutation<
    LoginReponse,
    unknown,
    LoginRequestBody
  >(login);

  useEffect(() => {
    if (data === undefined) {
      return;
    }

    setTimeout(() => {
      const { session, refresh } = data.token;

      authenticate(session, refresh);
    }, SHOW_RESPONSE_MILISECONDS);
  }, [data]);

  useEffect(() => {
    if (!isError) {
      return;
    }

    setTimeout(() => {
      setShowLoader(false);
    }, SHOW_RESPONSE_MILISECONDS);
  }, [isError]);

  const handleSubmit: LoginFormProps["onSubmit"] = (data) => {
    Keyboard.dismiss();
    setShowLoader(true);
    mutate(data);
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <LoginForm onSubmit={handleSubmit} isError={isError} />

      {showLoader && (
        <LoginLoading error={isError} success={isSuccess} style={s.loading} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  loading: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "120%",
  },
});

export default LoginPage;
