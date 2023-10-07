import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { format } from "timeago.js";
import { resolveRelationship } from "@/core/data/relationships";
import { Props } from "./chapter-card.props";
import theme from "@/core/theme";

function ChapterCard(props: Props) {
  const {
    chapter: { attributes, relationships, isRead },
  } = props;

  const scan = useMemo(
    () => resolveRelationship(relationships, "scanlation_group"),
    [relationships]
  );

  const hasChapterTitle = Boolean(attributes.title);
  const hasScan = Boolean(scan?.attributes.name);

  return (
    <View style={s.container}>
      <View
        style={[s.indicatorBase, isRead ? s.indicatorRead : s.indicatorPending]}
      />
      <View style={s.rightPart}>
        <Text style={s.title}>
          {hasChapterTitle && "Ch."} {attributes.chapter}{" "}
          {hasChapterTitle && "-"} {attributes.title}
        </Text>
        <Text style={s.subTitle}>
          {scan?.attributes.name} {hasScan && "•"}{" "}
          {format(new Date(attributes.readableAt))}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
    flexDirection: "row",
    gap: 8,
  },
  indicatorBase: {
    width: 6,
    height: 6,
    marginTop: 6,
    borderRadius: 2222,
  },
  indicatorRead: {
    backgroundColor: "#60A5FA",
  },
  indicatorPending: {
    borderColor: "#9CA3AF",
    borderWidth: 1,
  },
  rightPart: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
    lineHeight: 18,
    color: "#030712",
    fontFamily: theme.font.poppins.bold,
  },
  subTitle: {
    fontSize: 12,
    lineHeight: 14,
    color: "#9CA3AF",
    fontFamily: theme.font.nunito.reguler,
  },
});

export default ChapterCard;
