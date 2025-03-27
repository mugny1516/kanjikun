import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-lg mx-auto text-center space-y-6 p-6 bg-white rounded-xl shadow-xl">
        <h2 className="text-3xl font-semibold text-gray-800">
          お探しのページは見つかりませんでした
        </h2>
        <p className="text-lg text-gray-600">
          ご指定のリソースが見つかりませんでした。もう一度お試しください。
        </p>
        <Button asChild>
          <Link href="/">ホームへ戻る</Link>
        </Button>
      </div>
    </div>
  );
}
