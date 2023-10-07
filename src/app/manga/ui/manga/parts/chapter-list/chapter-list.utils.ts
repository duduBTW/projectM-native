import {
  fetchMangaFeed,
  FetchMangaFeedDto,
  FetchMangaFeedQueryParams,
} from "@/app/manga/data/manga";
import { fetchReadMarkers } from "@/app/manga/data/markers";

export const CHAPTERS_PER_PAGE = 100;
export const DEFAULT_CHAPTER_LIST_PARAMS: Omit<
  FetchMangaFeedQueryParams,
  "offset"
> = {
  limit: CHAPTERS_PER_PAGE,
  order: {
    volume: "desc",
    chapter: "desc",
  },
  translatedLanguage: ["en"],
  includes: ["scanlation_group", "user"],
};

export async function fetchChapterList(
  mangaId: string,
  offset: FetchMangaFeedQueryParams["offset"]
) {
  const { data: feed, total } = await fetchMangaFeed(mangaId, {
    ...DEFAULT_CHAPTER_LIST_PARAMS,
    offset,
  });

  const readMarkers = await fetchReadMarkers({
    grouped: true,
    ids: [mangaId],
  });

  const readMarker = readMarkers.data[mangaId];
  const resultData = feed.map<MangaFeedChapter>((chapter) => ({
    ...chapter,
    isRead: readMarker?.includes(chapter.id),
  }));

  return {
    data: resultData,
    total,
  };
}

export function getChapterListKey(mangaId: string) {
  return ["manga-chapter-list", mangaId];
}

export type MangaFeedChapter = FetchMangaFeedDto & {
  isRead?: boolean;
};

export type FetchChapterListResult = ReturnType<
  Awaited<typeof fetchChapterList>
>;
