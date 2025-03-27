"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ScenarioGallery from "../../components/ScenarioGallery";

export default function Page() {
  return (
    <div className="min-h-screen mt-10 p-6">
      <div className="max-w-lg mx-auto text-center space-y-6 p-6 ">
        <h1 className="text-3xl font-semibold text-gray-800">
          イベントを削除しました
        </h1>
        <p className="text-lg text-gray-600">
          新しいイベントを作成しましょう。
        </p>
        <Button asChild>
          <Link href="/new">新しいイベントを作る</Link>
        </Button>
      </div>
      <ScenarioGallery />
    </div>
  );
}
