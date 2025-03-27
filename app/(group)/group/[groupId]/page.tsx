import AttendanceFormWrapper from "../../components/AttendanceFormWrapper";
import {
  getGroup,
  getDateOptionsForGroup,
  getAttendancesWithAvailabilitiesForGroup,
} from "@/app/datas/group";
import GroupDetails from "../../components/GroupDetails";

import ClientSideSaveGroup from "@/app/components/ClientSideSaveGroup";
import { Metadata } from "next";
import ShareEventURL from "@/app/components/ShareEventURL";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ groupId: string }>;
}): Promise<Metadata> {
  const { groupId } = await params;
  const group = await getGroup(groupId);
  return {
    title: group?.name || "グループ詳細",
  };
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const [group, dateOptions, attendances] = await Promise.all([
    getGroup(groupId),
    getDateOptionsForGroup(groupId),
    getAttendancesWithAvailabilitiesForGroup(groupId),
  ]);
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/group/${group.id}`;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-12 space-y-6 ">
      <ClientSideSaveGroup group={group} />

      <div className="space-y-4">
        <GroupDetails
          group={group}
          dateOptions={dateOptions}
          attendances={attendances}
        />
        <AttendanceFormWrapper
          groupId={groupId}
          finalDate={group.final_date}
          dateOptions={dateOptions}
          attendances={attendances}
        />
      </div>

      <div className="my-24"></div>
      <ShareEventURL shareUrl={shareUrl} />
    </div>
  );
}
