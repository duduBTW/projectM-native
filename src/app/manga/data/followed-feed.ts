import { LanguageCode } from "@/core/contants/languages";
import { mangadexApi } from "@/core/data/api";
import {
  ResponseRelationship,
  ResponseRelationshipType,
  resolveRelationship,
} from "@/core/data/relationships";
import qs from "query-string";
import { FetchMangaDto, fetchMangaList } from "./manga";
import { fetchReadMarkers } from "./markers";

export async function fetchFollowedFeed(params: FollowedFeedQueryParams) {
  const {
    limit = 10,
    offset = 0,
    order = {
      by: "desc",
      type: "readableAt",
    },
    ...rest
  } = params;

  const { data } = await mangadexApi.get<FollowedFeedResponse>(
    `/user/follows/manga/feed?order[${order.type}]=${order.by}`,
    {
      params: {
        ...rest,
        limit,
        offset,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, {
          arrayFormat: "bracket",
          encode: false,
        });
      },
    }
  );

  return data;
}

//** Creates a factory for followedFeed, returns a function that recieves the pagination offset as a param */
export function fetchFeed(params: Omit<FollowedFeedQueryParams, "offset">) {
  return async (offset: FollowedFeedQueryParams["offset"]) => {
    const { data: chapters, total } = await fetchFollowedFeed({
      ...params,
      offset,
    });

    const mangaIds: string[] = [];
    chapters.map((chapter) => {
      const manga = resolveRelationship(chapter.relationships, "manga");
      if (!manga) {
        return;
      }

      mangaIds.push(manga.id);
    });

    const { data: mangas } = await fetchMangaList({
      ids: mangaIds,
      includes: ["cover_art"],
    });

    const mangaLookuptable = new Map<string, FetchMangaDto>();
    mangas.forEach((manga) => {
      mangaLookuptable.set(manga.id, manga);
    });

    const readMarkers = await fetchReadMarkers({
      grouped: true,
      ids: mangaIds,
    });

    const result: FollowedFeedItem[] = [];
    chapters.forEach((chapter) => {
      const mangaId = resolveRelationship(chapter.relationships, "manga")?.id;
      if (mangaId === undefined) {
        return;
      }

      const manga = mangaLookuptable.get(mangaId);
      if (manga === undefined) {
        return;
      }

      const readMarker = readMarkers.data[mangaId]?.some(
        (chapterReadMarker) => chapterReadMarker === chapter.id
      );

      result.push({
        chapter,
        manga,
        isRead: readMarker !== undefined && readMarker,
      });
    });

    return result;
  };
}

fetchFeed.key = (offset: FollowedFeedQueryParams["offset"]) => [
  "paginated-followed-feed",
  offset,
];

// ---------------
// Types
// ---------------
export type FollowedFeedQueryParams = {
  limit?: number;
  offset?: number;
  translatedLanguage?: LanguageCode[];
  includes?: ResponseRelationshipType[];
  contentRating?: string[];
  order?: {
    type:
      | "createdAt"
      | "updatedAt"
      | "publishAt"
      | "readableAt"
      | "volume"
      | "chapter";
    by: "asc" | "desc";
  };
};

export type FollowedFeedChapterDto = {
  id: string;
  type: "chapter";
  attributes: {
    title?: string | null;
    volume?: string | null;
    chapter?: string | null;
    pages: number;
    translatedLanguage: string;
    uploader: string;
    externalUrl?: string | null;
    version: number;
    createdAt: string;
    updatedAt: string;
    publishAt: string;
    readableAt: string;
  };
  relationships: ResponseRelationship[];
};

export type FollowedFeedResponse = {
  result: string;
  response: string;
  limit: number;
  offset: number;
  total: number;
  data: FollowedFeedChapterDto[];
};

export type FollowedFeedItem = {
  manga: FetchMangaDto;
  chapter: FollowedFeedChapterDto;
  isRead: boolean;
};
