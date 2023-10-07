import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchRefreshToken } from "@/app/auth/data/login";

const AUTH_TOKEN_KEY = "auth-token";
const AUTH_REFRESH_TOKEN_KEY = "refresh-auth-token";

export const storageAuthToken = {
  get: async () => {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  },
  set: async (newToken: string) => {
    return await AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken);
  },
  remove: async () => {
    return await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  },
};

export const storageRefreshToken = {
  get: async () => {
    return await AsyncStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
  },
  set: async (newToken: string) => {
    return await AsyncStorage.setItem(AUTH_REFRESH_TOKEN_KEY, newToken);
  },
  remove: async () => {
    return await AsyncStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  },
  refresh: async function () {
    const oldToken = await this.get();
    if (!oldToken) {
      return;
    }

    const {
      token: { refresh, session },
    } = await fetchRefreshToken(oldToken);

    await Promise.all([storageAuthToken.set(session), await this.set(refresh)]);

    return session;
  },
};
