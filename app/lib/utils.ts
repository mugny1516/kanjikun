// リッチテキストのフォーマット
export const formatRichText = (richText: string): string => {
  // ここでシンタックスハイライトや画像最適化などの処理を追加
  return richText;
};

// 日付フォーマット関数
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
