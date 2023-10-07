import { View, Text } from "react-native";
import { Props } from "./manga-page.props";
import { CoverList, ChapterList } from "./parts";

function MangaPage(props: Props) {
  const {
    route: {
      params: { mangaId, mangaTitle },
    },
  } = props;

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ChapterList
        listProps={{
          ListHeaderComponent: (
            <>
              <CoverList mangaId={mangaId} />
              <Text
                style={{
                  marginLeft: 20,
                  marginBottom: 12,
                }}
              >
                Chapters
              </Text>
            </>
          ),
        }}
        mangaId={mangaId}
      />
    </View>
  );
}

export default MangaPage;
