"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";

type Scenario = {
  image: string;
  title: string;
  description: string;
};

const scenarios: Scenario[] = [
  {
    image: "girl8.png",
    title: "会議シーン",
    description: "少人数の打ち合わせに最適なシナリオです。",
  },
  {
    image: "girl2.png",
    title: "イベントシーン",
    description: "大人数のイベントでもスムーズにスケジュール調整。",
  },
  {
    image: "girl3.png",
    title: "パーティーシーン",
    description: "歓談の合間に、みんなの都合がひと目でわかる！",
  },
  {
    image: "girl4.png",
    title: "打ち上げシーン",
    description: "幹事と参加者のスケジュールを効率的に管理。",
  },
  // 必要に応じてさらにシナリオを追加
];

export default function ScenarioGallery() {
  return (
    <div className="space-y-4 my-8">
      <h2 className="text-2xl font-bold text-center">
        「幹事くん」はこんなイベントに便利！
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {scenarios.map((scenario, index) => (
          <Card key={index} className="p-2">
            <div className="relative aspect-square">
              <Image
                src={`/${scenario.image}`}
                alt={scenario.title}
                fill
                sizes="200px"
                className="object-cover rounded-md"
              />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">{scenario.title}</h3>
              <p className="text-sm text-gray-600">{scenario.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
