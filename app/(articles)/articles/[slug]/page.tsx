import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleList, getArticleDetail } from "@/app/datas/articles";
import Article from "../../components/Article";
import { Suspense } from "react";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ dk?: string }>;
};

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const { contents } = await getArticleList({ limit: 100, fields: "id" });
    return contents.map((article) => ({ slug: article.id }));
  } catch (error) {
    console.error("静的パス生成エラー:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const sp = await searchParams;
    const data = await getArticleDetail(slug, { draftKey: sp.dk });
    return {
      title: data.title,
      description: data.description,
      openGraph: {
        title: data.title,
        description: data.description,
        images: data.thumbnail ? [data.thumbnail.url] : ["/dummy.jpg"],
      },
      alternates: {
        canonical: `/articles/${slug}`,
      },
    };
  } catch (error) {
    console.error("メタデータ生成エラー", error);
    return {
      title: "記事の読み込みエラー",
      description: "記事のメタデータを取得できませんでした。",
    };
  }
}

export const revalidate = 60;

export default async function ArticlePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const draftKey = sp.dk;
  try {
    return (
      <Suspense fallback={<div>記事を読み込んでいます...</div>}>
        <ArticleLoader slug={slug} draftKey={draftKey} />
      </Suspense>
    );
  } catch (error) {
    console.error(`記事ページ(${slug})の読み込みエラー:`, error);
    notFound();
  }
}

async function ArticleLoader({
  slug,
  draftKey,
}: {
  slug: string;
  draftKey?: string;
}) {
  try {
    const data = await getArticleDetail(slug, { draftKey });
    return <Article data={data} />;
  } catch (error) {
    console.error(`ArticleLoaderでの記事(${slug})読み込みエラー:`, error);
    notFound();
  }
}
