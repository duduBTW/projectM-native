import { resolveRelationship } from "@/core/data/relationships";
import {
  FetchAggregateResponse,
  FetchChapterQueryParams,
  fetchAggregate,
  fetchChapter,
  fetchServer,
} from "../../data/chapter";

const FETCH_CHAPTER_PARAMS: FetchChapterQueryParams = {
  includes: ["scanlation_group", "manga", "user"],
};

export async function fetchPages(chapterId: string) {
  const [chapter, server] = await Promise.all([
    fetchChapter(chapterId, FETCH_CHAPTER_PARAMS),
    fetchServer(chapterId, { forcePort443: false }),
  ]);

  const mangaId = resolveRelationship(chapter.data.relationships, "manga")?.id;
  const scanId = resolveRelationship(
    chapter.data.relationships,
    "scanlation_group"
  )?.id;

  let aggregatedChapters: FetchAggregateResponse | undefined = undefined;
  if (mangaId) {
    aggregatedChapters = await fetchAggregate(mangaId, {
      groups: scanId ? [scanId] : [],
    });
  }

  const pages = server.chapter.data.map(
    (fileUrl) => `${server.baseUrl}/data/${server.chapter.hash}/${fileUrl}`
  );

  return { chapter, pages, aggregatedChapters };
}
fetchPages.key = (chapterId: string) => ["reader-chapter", chapterId];
