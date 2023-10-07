import { FlatList, StyleSheet, View, Image } from "react-native";
import { useQuery } from "@tanstack/react-query";
import {
  fetchCoverList,
  FetchCoverListQueryParams,
} from "@/app/manga/data/manga";
import { CoverProps, Props } from "./cover-list.props";
import resolveCover from "@/core/ui/cover/utils";
import { resolveRelationship } from "@/core/data/relationships";

function CoverList(props: Props) {
  const { mangaId } = props;
  const params: FetchCoverListQueryParams = {
    manga: [mangaId],
    order: {
      by: "desc",
      type: "volume",
    },
  };

  const { data: covers, isLoading } = useQuery(fetchCoverList.key(params), () =>
    fetchCoverList(params)
  );

  if (covers === undefined || isLoading) {
    return <View style={s.container} />;
  }

  return (
    <FlatList
      style={s.container}
      data={covers.data}
      horizontal
      contentContainerStyle={s.contentContainerStyle}
      ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
      keyExtractor={(item) => item.id}
      renderItem={({
        item: {
          attributes: { fileName },
          relationships,
        },
      }) => {
        const manga = resolveRelationship(relationships, "manga");

        return (
          <Cover
            source={{
              uri: resolveCover({
                fileName,
                mangaId: manga?.id ?? "",
                fileSize: "256",
              }),
            }}
          />
        );
      }}
    />
  );
}

function Cover(props: CoverProps) {
  return <Image {...props} style={[s.cover, props.style]} />;
}

const s = StyleSheet.create({
  container: {
    marginBottom: 12,
    height: 224 + 8 + 12,
  },
  cover: {
    height: 224,
    width: 144,
    borderRadius: 12,
  },
  contentContainerStyle: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
});

export default CoverList;
