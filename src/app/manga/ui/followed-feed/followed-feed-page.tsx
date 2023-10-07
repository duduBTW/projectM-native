import { useMemo } from "react";
import {
  Button,
  RefreshControl,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "@/core/auth/auth-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFeed } from "../../data/followed-feed";
import FeedChapterCard from "./parts/card/card";
import CircularProgressIndicator from "@/core/ui/circular-progress-indicator";
import { Props } from "./followed-feed-page.props";
import { navigateToChapter } from "@/core/navigation/navigateToChapter";

const ITEMS_PER_PAGE = 26;
const getFeed = fetchFeed({
  limit: ITEMS_PER_PAGE,
  translatedLanguage: ["en"],
  includes: ["manga", "scanlation_group"],
});

function FeedPage(props: Props) {
  const { navigation } = props;

  const { logOut } = useAuth();
  const { data, fetchNextPage, isFetchingNextPage, isRefetching, refetch } =
    useInfiniteQuery({
      queryKey: fetchFeed.key(1),
      queryFn: ({ pageParam = 0 }) => getFeed(pageParam),
      getNextPageParam: (_, allPages) => allPages.length * ITEMS_PER_PAGE,
    });

  const feedData = useMemo(() => {
    if (!data) {
      return;
    }

    return data.pages.flat();
  }, [data]);

  return (
    <View style={s.contaner}>
      {feedData ? (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          data={feedData}
          renderItem={({ item: feedItem }) => (
            <FeedChapterCard
              onMangaClick={() =>
                navigation.push("Manga", {
                  mangaId: feedItem.manga.id,
                  mangaTitle: feedItem.manga.attributes.title["en"],
                })
              }
              onChapterClick={() => {
                navigateToChapter(navigation.push, {
                  chapterId: feedItem.chapter.id,
                  relationships: feedItem.chapter.relationships,
                });
              }}
              feedItem={feedItem}
            />
          )}
          ListFooterComponent={() => (
            <View style={s.loadingMore}>
              {isFetchingNextPage ? <CircularProgressIndicator /> : null}
            </View>
          )}
          ListHeaderComponent={() => <Text style={s.title}>Your feed</Text>}
          keyExtractor={(feedItem) => feedItem.chapter.id}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          contentContainerStyle={s.contentContainerStyle}
          onEndReached={() => fetchNextPage()}
        />
      ) : (
        <View style={s.mainLoader}>
          <View>
            <CircularProgressIndicator />
          </View>
        </View>
      )}
      <Button onPress={logOut} title="log out" />
    </View>
  );
}

const s = StyleSheet.create({
  contaner: {
    flex: 1,
  },
  mainLoader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: 16,
    color: "#4B5563",
  },
  contentContainerStyle: {
    padding: 16,
  },
  loadingMore: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FeedPage;
