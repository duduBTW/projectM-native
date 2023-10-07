import { FollowedFeedItem } from "@/app/manga/data/followed-feed";
import { Image } from "react-native";

export type Props = {
  feedItem: FollowedFeedItem;
  onMangaClick: (feedItem: FollowedFeedItem) => void;
  onChapterClick: () => void;
};
