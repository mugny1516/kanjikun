// app/content/about/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "運営元情報",
  description: "このサイトの運営元に関する情報です。",
  alternates: {
    canonical: "/content/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <h1>運営元情報</h1>

      <section>
        <h2>サイト名</h2>
        <p>[幹事くん])</p>
      </section>

      <section>
        <h2>運営者</h2>
        <p>K.N</p>
      </section>

      <section>
        <h2>連絡先</h2>
        <p>
          お問い合わせは、<a href="/content/contact">お問い合わせフォーム</a>
          よりお願いいたします。
        </p>
      </section>
    </>
  );
}
