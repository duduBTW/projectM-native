import { mangadexApi } from "@/core/data/api";
import {
  ResponseRelationship,
  ResponseRelationshipType,
} from "@/core/data/relationships";
import { LanguageCode } from "@/core/contants/languages";

export async function fetchMangaList(params: FetchMangaListQueryParams) {
  const { data } = await mangadexApi.get<FetchMangaListResponse>("/manga", {
    params,
  });

  return data;
}

export async function fetchManga(id: string, params: FetchMangaQueryParams) {
  const { data } = await mangadexApi.get<FetchMangaResponse>(`/manga/${id}`, {
    params,
  });

  return data;
}

export async function fetchCoverList(params: FetchCoverListQueryParams) {
  const {
    limit = 100,
    offset = 0,
    order = {
      by: "asc",
      type: "volume",
    },
    ...rest
  } = params;

  const { data } = await mangadexApi.get<FetchCoverListResponse>(
    `/cover?order[${order.type}]=${order.by}`,
    {
      params: {
        ...rest,
        limit,
        offset,
      },
    }
  );

  return data;
}

fetchCoverList.key = (params: FetchCoverListQueryParams) => [
  "cover-list",
  params,
];

export async function fetchMangaFeed(
  id: string,
  params: FetchMangaFeedQueryParams
) {
  const { order, ...rest } = params;

  const { data } = await mangadexApi.get<FetchMangaFeedResponse>(
    `/manga/${id}/feed?order[volume]=${order.volume}&order[chapter]=${order.chapter}`,
    {
      params: rest,
    }
  );

  return data;
}
fetchMangaFeed.key = (id: string, params: FetchMangaFeedQueryParams) => [
  "manga-feed",
  id,
  params,
];

// ----------
// Manga List
// ----------
export type FetchMangaListQueryParams = {
  ids: string[];
  includes?: ResponseRelationshipType[];
};

export type FetchMangaListResponse = {
  result: string;
  response: string;
  data: FetchMangaDto[];
  limit: number;
  offset: number;
  total: number;
};

// ----------
// Manga Item
// ----------
export type FetchMangaQueryParams = {
  includes?: ResponseRelationshipType[];
};

export type FetchMangaResponse = {
  result: string;
  response: string;
  data: FetchMangaDto;
  limit: number;
  offset: number;
  total: number;
};

// ----------
// Shared Item
// ----------
export type FetchMangaDto = {
  id: string;
  type: string;
  attributes: FetchMangaDtoAttributes;
  relationships: ResponseRelationship[];
};

export type FetchMangaDtoAttributes = {
  title: Record<LanguageCode, string>;
  altTitles: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  isLocked: boolean;
  links: Record<LanguageCode, string>;
  originalLanguage: string;
  lastVolume: string;
  lastChapter: string;
  publicationDemographic?: string;
  status: string;
  year: number;
  contentRating: string;
  state: string;
  chapterNumbersResetOnNewVolume: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
  availableTranslatedLanguages: string | undefined[];
  latestUploadedChapter: string;
};

// ----------
// Cover
// ----------
export type FetchCoverListQueryParams = {
  ids?: string[];
  includes?: ResponseRelationshipType[];
  manga?: string[];
  uploaders?: string[];
  locales?: string[];
  limit?: number;
  offset?: number;
  order?: {
    type: "createdAt" | "updatedAt" | "volume";
    by: "asc" | "desc";
  };
};

export type FetchCoverListResponse = {
  result: string;
  response: string;
  data: FetchCoverListDto[];
  limit: number;
  offset: number;
  total: number;
};

export type FetchCoverListDto = {
  id: string;
  type: string;
  attributes: FetchCoverListAttributes;
  relationships: ResponseRelationship[];
};

export type FetchCoverListAttributes = {
  description: string;
  volume: string;
  fileName: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  version: number;
};

// -------------
// Manga Feed
// -------------
export type FetchMangaFeedQueryParams = {
  limit: number;
  offset: number;
  translatedLanguage: LanguageCode[];
  includes?: ResponseRelationshipType[];
  order: {
    chapter: "asc" | "desc";
    volume: "asc" | "desc";
  };
};

export type FetchMangaFeedResponse = {
  result: string;
  response: string;
  data: FetchMangaFeedDto[];
  limit: number;
  offset: number;
  total: number;
};

export type FetchMangaFeedDto = {
  id: string;
  type: string;
  attributes: FetchMangaFeedAttributes;
  relationships: ResponseRelationship[];
};

export type FetchMangaFeedAttributes = {
  volume?: string | null;
  chapter: string;
  title?: string | null;
  translatedLanguage: string;
  externalUrl?: string | null;
  publishAt: string;
  readableAt: string;
  createdAt: string;
  updatedAt: string;
  pages: number;
  version: number;
};
