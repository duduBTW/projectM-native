import { useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { format } from "timeago.js";
import resolveCover from "@/core/ui/cover/utils";
import { Props } from "./card.props";
import { resolveRelationship } from "@/core/data/relationships";
import theme from "@/core/theme";

function chapterCover(manga: Props["feedItem"]["manga"]) {
  const coverRelationship = resolveRelationship(
    manga.relationships,
    "cover_art"
  );

  if (coverRelationship === undefined) {
    return;
  }

  return resolveCover({
    mangaId: manga.id,
    fileName: coverRelationship.attributes.fileName,
    fileSize: "256",
  });
}

function FeedChapterCard(props: Props) {
  const {
    feedItem: { manga, chapter, isRead },
    onMangaClick,
    onChapterClick,
  } = props;

  const scan = useMemo(
    () => resolveRelationship(chapter.relationships, "scanlation_group"),
    [chapter]
  );
  const coverUri = useMemo(() => chapterCover(manga), [chapter]);
  const hasTitle = Boolean(chapter.attributes.title?.trim());
  const subTitle = `${scan?.attributes.name} • ${format(
    new Date(chapter.attributes.readableAt)
  )}`;

  const handleCoverPress = () => {
    onMangaClick(props.feedItem);
  };

  const handleChapterPress = () => {
    onChapterClick();
  };

  return (
    <View style={[s.container, isRead && s.containerRead]}>
      <Pressable onPress={handleCoverPress}>
        <Image
          source={{
            uri: coverUri,
          }}
          style={s.cover}
        />
      </Pressable>

      <Pressable onPress={handleChapterPress} style={s.rightPart}>
        <Text style={s.chapterTitle}>
          Ch. {chapter.attributes.chapter} {hasTitle && "-"}{" "}
          {chapter.attributes.title}
        </Text>
        <Text style={s.chapterSubTitle}>{subTitle}</Text>
        <View style={s.spacer} />
        <Text style={s.mangaTitle}>{manga.attributes.title["en"]}</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.color.gray["50"],
    borderColor: theme.color.gray["50"],
    borderWidth: 8,
    borderRadius: theme.border.rouded,
  },
  containerRead: {
    backgroundColor: theme.color.white,
    borderColor: theme.color.white,
  },
  cover: {
    height: 146,
    width: 100,
    borderRadius: theme.border.roundedSm,
  },
  rightPart: {
    flex: 1,
    paddingHorizontal: theme.size["3"],
    paddingVertical: theme.size["2"],
    gap: theme.size["1"],
  },
  chapterTitle: {
    fontSize: theme.font.size["base"],
    lineHeight: theme.font.height["base"],
    color: theme.color.brand.main,
    fontFamily: theme.font.poppins.extraBold,
  },
  chapterSubTitle: {
    fontSize: theme.font.size["sm"],
    lineHeight: theme.font.height["sm"],
    color: theme.color.gray["500"],
    fontFamily: theme.font.nunito.reguler,
  },
  spacer: {
    flex: 1,
  },
  mangaTitle: {
    fontSize: theme.font.size["xs"],
    lineHeight: theme.font.height["xs"],
    color: theme.color.gray["400"],
    fontFamily: theme.font.nunito.reguler,
  },
});

export default FeedChapterCard;
