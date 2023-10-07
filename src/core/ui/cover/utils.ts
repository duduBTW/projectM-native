function resolveCover(data: {
  mangaId: string;
  fileName: string;
  fileSize?: "256" | "512";
}) {
  const getFileSizeUrl = () => {
    const { fileSize } = data;
    if (fileSize === undefined) {
      return "";
    }

    return `${fileSize}.jpg`;
  };

  return `${process.env.EXPO_PUBLIC_MANGADEX_CDN_URL}/covers/${data.mangaId}/${
    data.fileName
  }.${getFileSizeUrl()}`;
}

export default resolveCover;
