import { FetchMangaDtoAttributes } from "@/app/manga/data/manga";
import { LanguageCode } from "../contants/languages";

export const RELATIONSHIP_TYPES = {
  SCAN: "scanlation_group",
  MANGA: "manga",
  USER: "user",
  COVER: "cover_art",
} as const;

export type ResponseRelationshipTypes = typeof RELATIONSHIP_TYPES;

export type ResponseRelationshipType =
  ResponseRelationshipTypes[keyof ResponseRelationshipTypes];

export type ScanRelationship = {
  id: string;
  type: ResponseRelationshipTypes["SCAN"];
  attributes: {
    website?: string | null;
    version: number;
    verified: boolean;
    updatedAt: string;
    twitter?: string | null;
    official: boolean;
    name: string;
    mangaUpdates?: string | null;
    locked: boolean;
    focusedLanguages: string[];
    discord: string;
    description: string;
    createdAt: string;
    contactEmail?: string;
    altNames: Record<LanguageCode, string>;
  };
};

type MangaRelationShip = {
  id: string;
  type: ResponseRelationshipTypes["MANGA"];
  attributes: FetchMangaDtoAttributes;
};

type UserRelationship = {
  id: string;
  type: ResponseRelationshipTypes["USER"];
};

type CoverRelationship = {
  id: string;
  type: string;
  attributes: {
    description: string;
    volume: string;
    fileName: string;
    locale: string;
    createdAt: string;
    updatedAt: string;
    version: number;
  };
};

export type ResponseRelationship =
  | ScanRelationship
  | MangaRelationShip
  | UserRelationship;

type ObjectType<T> = T extends ResponseRelationshipTypes["MANGA"]
  ? MangaRelationShip
  : T extends ResponseRelationshipTypes["SCAN"]
  ? ScanRelationship
  : T extends ResponseRelationshipTypes["USER"]
  ? UserRelationship
  : T extends ResponseRelationshipTypes["COVER"]
  ? CoverRelationship
  : never;

export function resolveRelationship<T extends ResponseRelationshipType>(
  relationships: ResponseRelationship[],
  type: T
): ObjectType<T> | undefined {
  return relationships.find((relationship) => relationship.type === type) as
    | ObjectType<T>
    | undefined;
}
