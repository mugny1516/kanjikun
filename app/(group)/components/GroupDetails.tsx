import { Button } from "@/components/ui/button";
import {
  AttendanceWithAvailabilities,
  DateOption,
  Group,
} from "@/types/wrapper";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Pencil, Users } from "lucide-react";
import EventMarquee from "@/app/components/EventMarquee";

type GroupDetailsProps = {
  group: Group;
  dateOptions: DateOption[];
  attendances: AttendanceWithAvailabilities[];
};

export default function GroupDetails({
  group,
  attendances,
}: GroupDetailsProps) {
  const numberOfParticipants = attendances.length;

  return (
    <>
      <EventMarquee />
      {group.final_date && (
        <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white px-4 py-1 rounded-xl text-xl mt-20 font-bold ">
          {group.final_date} 開催確定 🎉
        </span>
      )}

      <Card className="p-6 bg-[#f9fdffb7] border-[#e5eeff] shadow-sm">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <h1 className="md:text-4xl text-2xl font-bold text-[#2C3E50]">
                {group.name}
              </h1>
            </div>
            <Button size="sm" asChild>
              <Link
                href={`/group/${group.id}/edit`}
                className="flex items-center gap-1"
              >
                <span>イベント管理（幹事用）</span>
                <Pencil className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-5 h-5" />
            <span className="text-l font-bold">
              回答者数: {numberOfParticipants} 名
            </span>
          </div>

          {group.memo && (
            <div>
              <Card className="p-4 bg-white/80 border-[#BDC3C7]">
                <p
                  className="text-gray-600 leading-relaxed"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {group.memo}
                </p>
              </Card>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
