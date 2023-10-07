import { mangadexApi } from "@/core/data/api";
import qs from "query-string";

export async function fetchReadMarkers(params: ReadMarkersQueryParams) {
  const { data } = await mangadexApi.get<ReadMarkersDto>("/manga/read", {
    params,
    paramsSerializer: (q) =>
      qs.stringify(q, {
        arrayFormat: "bracket",
        encode: false,
      }),
  });

  return data;
}

// ----------
// Types
// ----------
export type ReadMarkersQueryParams = {
  grouped?: boolean;
  ids: string[];
};

export type ReadMarkersDto = {
  result: string;
  data: Record<string, string[]>;
};
