"use client";

import Link from "next/link";
import LocalStorageGroupList from "./LocalStorageGroupList";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Smile, Share2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import ScenarioGallery from "./ScenarioGallery";
import EventMarquee from "./EventMarquee";

const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  }),
};

export default function Landing() {
  const scenarios = Array.from({ length: 8 }, (_, i) => `girl${i + 1}.png`);

  return (
    <div className="space-y-16">
      {/* ヒーローセクション */}
      <motion.section
        className="bg-[#2C3E50] text-white text-center py-20 px-4"
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeInVariant}
      >
        <div className="max-w-4xl mx-auto space-y-6 ">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight ">
            『飲み会、いつする？』
          </h1>
          <br />
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight md:px-20 ">
            「幹事くん」で 複数人のイベントの日程がパッと決まる！
          </h1>
          <br />
          <EventMarquee />
          <p className="text-xl font-medium text-[#ECF0F1]">
            会員登録不要・無料で使える
            <br />
            シンプルで直感的なスケジュール管理ツール
          </p>
          <Button asChild className="h-12 px-8 text-lg rounded-full">
            <Link href="/new">新しいイベントを作る</Link>
          </Button>
          <p className="text-sm text-[#BDC3C7]">
            スマホ・PC・ガラケー対応 | アプリ不要 | すぐ始められる
          </p>
        </div>
      </motion.section>

      {/* 利用シーンギャラリー */}
      <motion.section
        className="max-w-6xl mx-auto px-4 space-y-8"
        initial="hidden"
        animate="visible"
        custom={0.2}
        variants={fadeInVariant}
      >
        <h2 className="text-3xl font-bold text-center text-[#2C3E50]">
          会議からイベントまで、幅広いシーンで大活躍！
        </h2>
        <p className="text-center text-gray-600">
          幹事くんは急な予定調整から大人数のイベントまで対応。手間なくスムーズに！
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          {scenarios.map((image, index) => (
            <motion.div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-[#2C3E50] transition-all"
              initial="hidden"
              animate="visible"
              custom={0.4 + index * 0.05}
              variants={fadeInVariant}
            >
              <Image
                src={`/${image}`}
                alt={`利用シーン ${index + 1}`}
                sizes="200px"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 特徴セクション */}
      <motion.section
        className="max-w-6xl mx-auto px-4 space-y-12"
        initial="hidden"
        animate="visible"
        custom={0.4}
        variants={fadeInVariant}
      >
        <h2 className="text-3xl font-bold text-center text-[#2C3E50]">
          幹事くんの3ステップで簡単管理
        </h2>
        <p className="text-center text-gray-600">
          URL共有でメンバーを招待、出欠を自動集計。幹事の負担を大幅軽減！
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<CalendarCheck className="w-12 h-12 text-[#2C3E50]" />}
            title="1. 日程候補を作成"
            description="直感的なインターフェースで簡単入力。スマホでもPCでもサクサク操作。"
            customDelay={0.5}
          />
          <FeatureCard
            icon={<Share2 className="w-12 h-12 text-[#2C3E50]" />}
            title="2. メンバーを招待"
            description="URLをコピーして共有。登録不要で誰でもすぐ参加可能。"
            customDelay={0.6}
          />
          <FeatureCard
            icon={<Smile className="w-12 h-12 text-[#2C3E50]" />}
            title="3. 結果を確認"
            description="出欠を自動集計。コメントも見れて全体の意向が一目でわかる。"
            customDelay={0.7}
          />
        </div>
      </motion.section>

      <motion.section
        className="bg-[#2C3E50] text-white text-center py-20 px-4"
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeInVariant}
      >
        <div className="max-w-lg mx-auto text-center space-y-6 mb-10 ">
          <h1 className="text-3xl md:text-5xl font-semibold">
            さっそく、楽しいイベントをはじめましょう
          </h1>
          <Button asChild className="h-12 px-8 text-lg rounded-full my-6">
            <Link href="/new">新しいイベントを作る</Link>
          </Button>
        </div>
        <div className="px-6">
          <ScenarioGallery />
        </div>
      </motion.section>

      {/* 保存済みグループ */}
      <motion.section
        className="max-w-4xl mx-auto px-4 space-y-8 mb-16"
        initial="hidden"
        animate="visible"
        custom={0.8}
        variants={fadeInVariant}
      >
        <LocalStorageGroupList />
      </motion.section>
    </div>
  );
}

type CardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  customDelay: number;
};

const FeatureCard = ({ icon, title, description, customDelay }: CardProps) => (
  <motion.div
    className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-[#BDC3C7]"
    initial="hidden"
    animate="visible"
    custom={customDelay}
    variants={fadeInVariant}
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-[#2C3E50]">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);
