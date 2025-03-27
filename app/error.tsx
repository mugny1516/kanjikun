"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-lg mx-auto text-center space-y-6 p-6 bg-white rounded-xl shadow-xl">
        <h2 className="text-3xl font-semibold text-red-600">
          エラーが発生しました
        </h2>
        <p className="text-lg text-gray-600">
          申し訳ありません。予期しない問題が発生しました。もう一度お試しください。
        </p>
        <Button onClick={() => reset()} className="bg-red-500 hover:bg-red-600">
          もう一度読み込む
        </Button>
      </div>
    </div>
  );
}
