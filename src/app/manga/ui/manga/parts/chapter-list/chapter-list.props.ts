import { FlatList } from "react-native";
import { MangaFeedChapter } from "./chapter-list.utils";

export type Props = {
  mangaId: string;
  listProps?: Omit<
    React.ComponentProps<typeof FlatList<MangaFeedChapter>>,
    "data" | "keyExtractor" | "renderItem"
  >;
};
