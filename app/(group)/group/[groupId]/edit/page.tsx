import EditGroupForm from "@/app/(group)/components/EditGroupForm";
import {
  getGroup,
  getDateOptionsForGroup,
  getAttendancesWithAvailabilitiesForGroup,
} from "@/app/datas/group";

export default async function page({
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

  const groupData = {
    ...group,
    date_options: dateOptions,
    attendancesWithAvailabilities: attendances,
  };

  return <EditGroupForm group={groupData} />;
}
