import {
  FetchAggregateResponse,
  FetchAggregateVolumes,
} from "../../data/chapter";

export function chapterLoopuptableToList(
  chaptersLookuptable: FetchAggregateVolumes["chapters"]
) {
  return Object.values(chaptersLookuptable).map((chapter) => chapter);
}

export function volumeLookuptableToSections(
  volumesLookuptable: FetchAggregateResponse["volumes"]
) {
  return Object.values(volumesLookuptable).map(({ volume, chapters }) => ({
    title: volume,
    data: chapterLoopuptableToList(chapters),
  }));
}

export type VolumeSections = ReturnType<typeof volumeLookuptableToSections>;
