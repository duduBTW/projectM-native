import { useMemo } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import CircularProgressIndicator from "@/core/ui/circular-progress-indicator";
import { Props } from "./chapter-list.props";
import {
  CHAPTERS_PER_PAGE,
  fetchChapterList,
  getChapterListKey,
} from "./chapter-list.utils";
import ChapterCard from "../chapter-card";

function ChapterList(props: Props) {
  const { mangaId, listProps } = props;

  const {
    data,
    isLoading,
    fetchNextPage,
    isRefetching,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: getChapterListKey(mangaId),
    queryFn: ({ pageParam = 0 }) => fetchChapterList(mangaId, pageParam),
    getNextPageParam: (_, allPages) => {
      let totalLoaded = 0;
      allPages.forEach((page) => {
        totalLoaded += page.data.length;
      });

      if (allPages[0] && allPages[0].total <= totalLoaded) {
        return;
      }

      return allPages.length * CHAPTERS_PER_PAGE;
    },
  });

  const feedData = useMemo(() => {
    if (!data) {
      return;
    }

    return data.pages.flatMap(({ data }) => data);
  }, [data]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgressIndicator />
      </View>
    );
  }

  return (
    <FlatList
      {...listProps}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      data={feedData}
      contentContainerStyle={{
        paddingBottom: 24,
      }}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      keyExtractor={(item) => item.id}
      onEndReached={() => fetchNextPage()}
      ListFooterComponent={() => (
        <View
          style={{
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isFetchingNextPage ? <CircularProgressIndicator /> : null}
        </View>
      )}
      renderItem={({ item: chapter }) => <ChapterCard chapter={chapter} />}
    />
  );
}

export default ChapterList;
