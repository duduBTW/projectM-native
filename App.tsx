import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
} from "react-native";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";
import { Nunito_400Regular } from "@expo-google-fonts/nunito";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider, { Auth } from "@/core/auth/auth-provider";
import LoginPage from "@/app/auth/ui/login";
import FeedPage from "@/app/manga/ui/followed-feed/followed-feed-page";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MangaPage from "@/app/manga/ui/manga";
import theme from "@/core/theme";
import ReaderPage from "@/app/manga/ui/reader/reader-page";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FetchAggregateResponse } from "@/app/manga/data/chapter";
import ChapterSelector from "@/app/manga/ui/chapter-selector/chapter-selector";

export type RootStackParamList = {
  Login: undefined;
  MyFeed: undefined;
  Manga: { mangaId: string; mangaTitle?: string | null };
  Reader: { chapterId: string; scanId?: string };
  ChapterSelector: {
    aggregatedChapters: FetchAggregateResponse;
    activeChapterId?: string;
  };
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
const Stack = createNativeStackNavigator<RootStackParamList>();

// LogBox.ignoreAllLogs();

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
    Nunito_400Regular,
  });

  const getContent = ({ isLoading, authToken }: Auth) => {
    if (!fontsLoaded && !fontError) {
      return null;
    }

    if (isLoading) {
      return <Text>Loading...</Text>;
    }

    return (
      <Stack.Navigator>
        {authToken === null ? (
          <Stack.Screen
            name="Login"
            component={LoginPage}
            options={{
              animationTypeForReplace: "pop",
              headerShown: false,
            }}
          />
        ) : (
          <>
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="MyFeed"
              component={FeedPage}
            />
            <Stack.Screen
              name="Manga"
              options={({ route }) => ({
                animationTypeForReplace: "push",
                headerShadowVisible: false,
                title: route.params.mangaTitle ?? "",
                headerTitleAlign: "left",
                headerTintColor: theme.color.gray["400"],
                headerStyle: {
                  backgroundColor: "#F1F1F1",
                  fontFamily: "Poppins_700Bold",
                },
              })}
              component={MangaPage}
            />
            <Stack.Screen
              name="Reader"
              options={{
                animationTypeForReplace: "push",
                headerShown: false,
              }}
              component={ReaderPage}
            />
            <Stack.Screen
              name="ChapterSelector"
              options={{
                animation: "slide_from_bottom",
                animationDuration: 100,
                title: "Chapters",
                headerShadowVisible: false,
                headerStyle: {
                  backgroundColor: "#F1F1F1",
                },
              }}
              component={ChapterSelector}
            />
          </>
        )}
      </Stack.Navigator>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
        <GestureHandlerRootView
          style={{
            flex: 1,
          }}
        >
          <NavigationContainer>
            <AuthProvider>{getContent}</AuthProvider>
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
