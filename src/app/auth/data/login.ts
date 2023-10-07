import axios from "axios";
import { z } from "zod";

export const loginMangadexApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_MANGADEX_API_URL,
});

export const loginResponseSchema = z.object({
  result: z.string(),
  token: z.object({
    session: z.string(),
    refresh: z.string(),
  }),
});

export type LoginReponse = z.infer<typeof loginResponseSchema>;

export type LoginRequestBody = {
  username: string;
  password: string;
};

export type LoginErrorResponse = {
  result: "error";
  errors: {
    id: string;
    status: number;
    title: string;
    detail: string;
    context: string;
  }[];
};

export async function login(body: LoginRequestBody) {
  const { data } = await loginMangadexApi.post("/auth/login", body);

  return loginResponseSchema.parse(data);
}

export async function fetchRefreshToken(token: string) {
  const { data } = await loginMangadexApi.post("/auth/refresh", {
    token,
  });

  return loginResponseSchema.parse(data);
}
