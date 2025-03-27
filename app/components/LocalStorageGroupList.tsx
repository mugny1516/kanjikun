"use client";

import { useEffect, useState } from "react";
import { Group } from "@/types/wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function LocalStorageGroupList() {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const savedGroups = JSON.parse(
      localStorage.getItem("savedGroups") || "[]"
    ) as Group[];
    setGroups(savedGroups);
  }, []);

  return (
    <div className="mt-4 mb-6 space-y-4">
      <h2 className="text-3xl font-bold text-center text-[#2C3E50]">
        最近のイベント
      </h2>
      {!(groups.length > 0) && (
        <Card className="px-4 py-8 mx-6">
          <h3 className="text-lg font-bold tracking-tight text-center mb-1">
            まだイベントがありません🌙
          </h3>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Card key={group.id} className="p-4">
            <div className="flex flex-col justify-between h-full space-y-4">
              <div>
                <h4 className="text-lg font-semibold line-clamp-2">
                  {group.name}
                </h4>
              </div>

              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/group/${group.id}`}>開く</Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
