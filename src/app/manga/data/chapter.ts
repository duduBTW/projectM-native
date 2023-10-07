import { mangadexApi } from "@/core/data/api";
import {
  ResponseRelationship,
  ResponseRelationshipType,
} from "@/core/data/relationships";

export async function fetchChapter(
  chapterId: string,
  params: FetchChapterQueryParams
) {
  const { data } = await mangadexApi.get<FetchChapterResponse>(
    `/chapter/${chapterId}`,
    {
      params,
    }
  );

  return data;
}
fetchChapter.key = (chapterId: string, params: FetchChapterQueryParams) => [
  "chapter-item",
  chapterId,
  params,
];

export async function fetchServer(
  chapterId: string,
  params: FetchServerQueryParams
) {
  const { data } = await mangadexApi.get<FetchServerResponse>(
    `/at-home/server/${chapterId}`,
    { params }
  );

  return data;
}
fetchServer.key = (chapterId: string) => ["server", chapterId];

export async function fetchAggregate(
  mangaId: string,
  params: FetchAggregateQueryParams
) {
  const { data } = await mangadexApi.get<FetchAggregateResponse>(
    `/manga/${mangaId}/aggregate`,
    {
      params,
    }
  );

  return data;
}
fetchAggregate.key = (mangaId: string, params: FetchAggregateQueryParams) => [
  "aggregate",
  mangaId,
  params,
];

// ----------
// Types
// ----------
export type FetchChapterQueryParams = {
  includes?: ResponseRelationshipType[];
};

export type FetchChapterResponse = {
  result: string;
  response: string;
  data: FetchChapterDto;
};

export type FetchChapterDto = {
  id: string;
  type: string;
  attributes: FetchChapterAttributes;
  relationships: ResponseRelationship[];
};

export type FetchChapterAttributes = {
  volume?: string | null;
  chapter: string;
  title: string;
  translatedLanguage: string;
  externalUrl?: string | null;
  publishAt: string;
  readableAt: string;
  createdAt: string;
  updatedAt: string;
  pages: number;
  version: number;
};

export type FetchServerQueryParams = {
  ["forcePort443"]?: boolean;
};

export type FetchServerResponse = {
  result: string;
  baseUrl: string;
  chapter: ServerChapter;
};

export type ServerChapter = {
  hash: string;
  data: string[];
  dataSaver: string[];
};

export type FetchAggregateQueryParams = {
  groups?: string[];
};

export type FetchAggregateResponse = {
  result: string;
  volumes: Record<string, FetchAggregateVolumes>;
};

export type FetchAggregateVolumes = {
  volume: string;
  count: number;
  chapters: Record<string, FetchAggregateChapter>;
};

export type FetchAggregateChapter = {
  chapter: string;
  id: string;
  // others: any[]
  count: number;
};
