/**
 * 記事のHTMLの余白調整などをするための定義
 * */
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      typography: (theme) => ({
        gray: {
          css: {
            // --- 基本（スマホ）サイズ設定 ---
            h1: {
              fontSize: theme("fontSize.2xl"), // スマホ: 2xl (1.5rem)
              fontWeight: theme("fontWeight.bold"), // 太字に
              marginBottom: theme("spacing.4"),
            },
            h2: {
              fontSize: theme("fontSize.xl"), // スマホ: xl (1.25rem)
              fontWeight: theme("fontWeight.semibold"), // やや太字
              marginTop: theme("spacing.6"),
              marginBottom: theme("spacing.3"),
            },
            p: {
              lineHeight: "1.75", // 行間
              marginTop: theme("spacing.4"),
              marginBottom: theme("spacing.4"),
            },
            li: {
              lineHeight: "1.75", // リスト項目の行間
              marginTop: theme("spacing.1"),
              marginBottom: theme("spacing.1"),
            },
            img: {
              // 画像のスタイル
              marginTop: theme("spacing.6"), // 画像の上の余白
              marginBottom: theme("spacing.6"), // 画像の下の余白
              borderRadius: theme("borderRadius.md"), // 角丸
            },
          },
        },
        lg: {
          css: {
            h1: {
              fontSize: theme("fontSize.4xl"),
              marginBottom: theme("spacing.6"),
            },
            h2: {
              fontSize: theme("fontSize.3xl"),
              marginTop: theme("spacing.8"),
              marginBottom: theme("spacing.4"),
            },
            p: {
              marginTop: theme("spacing.5"),
              marginBottom: theme("spacing.5"),
            },
            li: {
              marginTop: theme("spacing.2"),
              marginBottom: theme("spacing.2"),
            },
            img: {
              marginTop: theme("spacing.8"),
              marginBottom: theme("spacing.8"),
              borderRadius: theme("borderRadius.lg"),
            },
          },
        },
      }),
    },
  },
  plugins: [import("@tailwindcss/typography")], // 動的インポート
};
