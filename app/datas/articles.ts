import { createClient } from "microcms-js-sdk";
import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSDate,
  MicroCMSContentId,
  MicroCMSListResponse,
} from "microcms-js-sdk";

export type Article = {
  title: string;
  description: string;
  content: string;
  thumbnail?: MicroCMSImage;
} & MicroCMSContentId &
  MicroCMSDate;

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_SERVICE_DOMAIN is required");
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error("MICROCMS_API_KEY is required");
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

export const getArticleList = async (
  queries?: MicroCMSQueries
): Promise<MicroCMSListResponse<Article>> => {
  try {
    const listData = await client.getList<Article>({
      endpoint: "articles",
      queries,
    });
    return listData;
  } catch (error) {
    console.error("記事一覧の取得に失敗しました:", error);
    return { contents: [], totalCount: 0, limit: 0, offset: 0 };
  }
};

export const getArticleDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
): Promise<Article> => {
  try {
    const detailData = await client.getListDetail<Article>({
      endpoint: "articles",
      contentId,
      queries,
    });
    return detailData;
  } catch {
    console.error(`記事詳細(${contentId})の取得に失敗しました`);
    throw new Error(`microCMSから記事詳細(${contentId})の取得に失敗しました`);
  }
};
