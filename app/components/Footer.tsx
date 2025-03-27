import Link from "next/link";

export default function Footer() {
  return (
    <footer className="sticky top-full border-t bg-[#090404]">
      <div className="max-w-[580px] mx-auto px-4 py-6">
        <nav className="flex flex-wrap justify-center space-x-4 mb-2">
          <Link
            href="/contact"
            className="text-sm text-gray-100 hover:text-gray-300"
          >
            お問い合わせ
          </Link>
          <Link
            href="/faq"
            className="text-sm text-gray-100 hover:text-gray-300"
          >
            よくある質問
          </Link>
          <Link
            href="/about"
            className="text-sm text-gray-100 hover:text-gray-300"
          >
            運営元情報
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-gray-100 hover:text-gray-300"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/terms"
            className="text-sm text-gray-100 hover:text-gray-300"
          >
            利用規約
          </Link>
        </nav>
        <p className="text-xs text-gray-500 text-center">© 2025 Kanjikun</p>
      </div>
    </footer>
  );
}
