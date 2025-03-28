import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { getArticleList } from "@/app/datas/articles";
import PublishedDate from "../components/Date";

export const metadata: Metadata = {
  title: "すべての記事",
  description: "すべての記事を閲覧できます。",
  alternates: {
    canonical: "/articles",
  },
};

type ArticleContent = {
  id: string;
  title: string;
  description?: string;
  publishedAt?: string;
  createdAt: string;
  thumbnail?: {
    url: string;
    height?: number;
    width?: number;
  };
};

type ArticleListResponse = {
  contents: ArticleContent[];
  totalCount: number;
  limit: number;
  offset: number;
};

// ISR
export const revalidate = 86400; // 1日

export default async function ArticlesPage() {
  let data: ArticleListResponse;
  try {
    data = await getArticleList({
      orders: "-publishedAt",
      fields: "id,title,description,publishedAt,createdAt,thumbnail",
    });
  } catch (error) {
    console.error("記事一覧の取得エラー:", error);
    return (
      <div className="text-red-600">
        記事一覧を読み込めませんでした。時間をおいて再試行してください。
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">すべての記事 📝</h1>
      {data.contents.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {data.contents.map((article) => (
            <li key={article.id} className="py-6">
              <Link
                href={`/articles/${article.id}`}
                className="flex items-start group"
              >
                {article.thumbnail ? (
                  <div className="flex-shrink-0 mr-4">
                    <Image
                      src={article.thumbnail.url}
                      alt=""
                      width={120}
                      height={80}
                      className="rounded object-cover aspect-[3/2]"
                      priority={false}
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 mr-4 w-[120px] h-[80px] bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
                <div className="flex-grow">
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>
                  {article.description && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {article.description}
                    </p>
                  )}
                  <PublishedDate
                    date={article.publishedAt || article.createdAt}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">記事が見つかりませんでした。</p>
      )}
    </div>
  );
}
