import Link from "next/link";

export default function Footer() {
  return (
    <footer className="sticky top-full border-t bg-[#090404] py-10">
      <div className="max-w-[580px] mx-auto px-4">
        {/* 2列レイアウト */}
        <nav className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
          <div className="space-y-4">
            <Link
              href="/contact"
              className="block text-sm text-gray-100 hover:text-gray-300 py-1"
            >
              お問い合わせ
            </Link>
            <Link
              href="/faq"
              className="block text-sm text-gray-100 hover:text-gray-300 py-1"
            >
              よくある質問
            </Link>
          </div>
          <div className="space-y-4">
            <Link
              href="/about"
              className="block text-sm text-gray-100 hover:text-gray-300 py-1"
            >
              運営元情報
            </Link>
            <Link
              href="/privacy"
              className="block text-sm text-gray-100 hover:text-gray-300 py-1"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/terms"
              className="block text-sm text-gray-100 hover:text-gray-300 py-1"
            >
              利用規約
            </Link>
          </div>
        </nav>
        <p className="text-xs text-gray-500 text-center mt-10">
          © 2025 Kanjikun
        </p>
      </div>
    </footer>
  );
}
