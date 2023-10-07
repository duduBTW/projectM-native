import {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { storageAuthToken, storageRefreshToken } from "./auth-storage";

export type Props = {
  children: React.ReactNode | ((authState: Auth) => React.ReactNode);
};

export type Auth = {
  authToken: null | string;
  isLoading: boolean;
  authenticate: (newToken: string, refreshToken: string) => void;
  logOut: () => void;
};

const AuthContext = createContext<Auth | null>(null);

function AuthProvider(props: Props) {
  const { children } = props;
  const [isLoading, setIsLoading] = useState<Auth["isLoading"]>(true);
  const [authToken, setAuthToken] = useState<Auth["authToken"]>(null);

  const authenticate = useCallback<Auth["authenticate"]>(
    async (newToken, refreshToken) => {
      await Promise.all([
        storageAuthToken.set(newToken),
        storageRefreshToken.set(refreshToken),
      ]);
      setAuthToken(newToken);
    },
    []
  );

  const logOut = useCallback<Auth["logOut"]>(async () => {
    await Promise.all([
      storageAuthToken.remove(),
      storageRefreshToken.remove(),
    ]);
    setAuthToken(null);
  }, []);

  useEffect(() => {
    storageAuthToken
      .get()
      .then(setAuthToken)
      .finally(() => setIsLoading(false));
  }, []);

  const authState = useMemo(
    () => ({
      authToken,
      isLoading,
      authenticate,
      logOut,
    }),
    [authToken, isLoading, authenticate, logOut]
  );

  return (
    <AuthContext.Provider value={authState}>
      {typeof children === "function" ? children(authState) : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const state = useContext(AuthContext);

  if (state === null) {
    throw new Error("useAuth needs to be used inside of a AuthProvider");
  }

  return state;
}

export default AuthProvider;
