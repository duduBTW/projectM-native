import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View, Image, Text, Pressable } from "react-native";
import { Props } from "./reader-page.props";
import CircularProgressIndicator from "@/core/ui/circular-progress-indicator";
import { resolveRelationship } from "@/core/data/relationships";
import { fetchPages } from "./reader-page.utils";
import Pages from "./parts/pages";
import Icon from "react-native-remix-icon";
import theme from "@/core/theme";

function ReaderPage(props: Props) {
  const { route, navigation } = props;
  const { chapterId, scanId } = route.params;

  const { data, isLoading } = useQuery(fetchPages.key(chapterId), () =>
    fetchPages(chapterId)
  );

  if (isLoading || data === undefined) {
    return (
      <View style={s.loaderContainer}>
        <CircularProgressIndicator />
      </View>
    );
  }

  const { chapter, pages, aggregatedChapters } = data;

  const manga = resolveRelationship(chapter.data.relationships, "manga");

  const handleChapterPress = () => {
    if (aggregatedChapters === undefined) {
      return;
    }

    navigation.push("ChapterSelector", {
      aggregatedChapters,
      activeChapterId: chapter.data.id,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: "black",
      }}
    >
      <View style={s.upperPart}>
        <Text>{manga?.attributes.title["en"]}</Text>
        <Text>{chapter.data.attributes.chapter}</Text>
      </View>

      <Pages pages={pages} />

      <View style={s.footer}>
        <Pressable onPress={handleChapterPress}>
          <Icon name="list-check" color="red" size="20" />
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    padding: theme.size["5"],
  },
  upperPart: {
    padding: theme.size["5"],
    gap: theme.size["1"],
  },
});

export default ReaderPage;
