import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import {
  ResponseRelationship,
  resolveRelationship,
} from "../data/relationships";

type Chapter = {
  chapterId: string;
  relationships?: ResponseRelationship[];
};

export function navigateToChapter(
  push: NativeStackScreenProps<RootStackParamList>["navigation"]["push"],
  { chapterId, relationships }: Chapter
) {
  let scanId: string | undefined = undefined;
  if (relationships) {
    scanId = resolveRelationship(relationships, "scanlation_group")?.id;
  }

  push("Reader", {
    chapterId,
    scanId,
  });
}
