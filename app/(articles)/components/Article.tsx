import PublishedDate from "./Date";
import { Article as ArticleType } from "@/app/datas/articles";
import { formatRichText } from "@/app/lib/utils";

type Props = {
  data: ArticleType;
};

export default function ArticleComponent({ data }: Props) {
  return (
    <main className="prose prose-gray prose-lg mx-auto dark:prose-invert space-y-6">
      <h1 className="text-4xl font-bold">{data.title}</h1>
      {data.description && (
        <p className="text-xl text-gray-600 !leading-snug">
          {data.description}
        </p>
      )}
      <div className="text-sm text-gray-500">
        <PublishedDate date={data.publishedAt || data.createdAt} />
      </div>
      <div
        className="space-y-4"
        dangerouslySetInnerHTML={{ __html: formatRichText(data.content) }}
      />
    </main>
  );
}
