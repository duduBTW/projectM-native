import { useMemo, useEffect, useRef } from "react";
import { SectionList, StyleSheet, Pressable, Text, View } from "react-native";
import { Props } from "./chapter-selector.props";
import { volumeLookuptableToSections } from "./chapter-selector.utils";
import theme from "@/core/theme";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";

const CHAPTER_CARD_HEIGHT = theme.font.height["sm"] + theme.size["2"] * 2;
const CHAPTER_CARD_MARGIN_TOP = theme.size["3"];
const VOLUME_TITLE_MARGIN_TOP = theme.size["7"];
const VOLUME_TITLE_HEIGHT = VOLUME_TITLE_MARGIN_TOP + theme.font.height["sm"];

function ChapterSelector(props: Props) {
  const { route } = props;
  const { aggregatedChapters, activeChapterId } = route.params;
  const scrollView = useRef<SectionList>(null);

  const sections = useMemo(() => {
    return volumeLookuptableToSections(aggregatedChapters.volumes);
  }, [aggregatedChapters]);

  useEffect(() => {
    if (activeChapterId === undefined) {
      return;
    }

    sections.map(({ data }, volumeIndex) => {
      data.map(({ id: chapterId }, chapterIndex) => {
        if (chapterId !== activeChapterId) {
          return;
        }

        scrollView.current?.scrollToLocation({
          itemIndex: chapterIndex,
          sectionIndex: volumeIndex,
        });
      });
    });
  }, [activeChapterId]);

  return (
    <View style={styles.container}>
      <SectionList
        // @ts-ignore
        getItemLayout={sectionListGetItemLayout({
          getItemHeight: () => CHAPTER_CARD_HEIGHT + CHAPTER_CARD_MARGIN_TOP,
          getSectionHeaderHeight: () => VOLUME_TITLE_HEIGHT,
        })}
        pagingEnabled={false}
        ref={scrollView}
        sections={sections}
        keyExtractor={({ id }) => id}
        renderItem={({ item: { chapter, id } }) => (
          <Pressable style={styles.chapterCard}>
            <Text style={styles.chapterTitle}>Chapter {chapter}</Text>
          </Pressable>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.volumeTitle}>Volume {title}</Text>
        )}
        contentContainerStyle={styles.sectionList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
  },
  sectionList: {
    paddingHorizontal: theme.size["4"],
    paddingBottom: theme.size["8"],
  },
  volumeTitle: {
    backgroundColor: "#F1F1F1",
    color: theme.color.gray["600"],
    marginTop: VOLUME_TITLE_MARGIN_TOP,
    fontSize: theme.font.size["sm"],
    lineHeight: theme.font.height["sm"],
    fontFamily: theme.font.poppins["medium"],
  },
  chapterCard: {
    backgroundColor: theme.color["white"],
    padding: theme.size["2"],
    marginTop: CHAPTER_CARD_MARGIN_TOP,
    borderRadius: theme.border.rouded,
    height: CHAPTER_CARD_HEIGHT,
  },
  chapterTitle: {
    fontSize: theme.font.size["sm"],
    lineHeight: theme.font.height["sm"],
    fontFamily: theme.font.poppins["bold"],
  },
});

export default ChapterSelector;
