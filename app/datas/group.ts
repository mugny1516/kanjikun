import "server-only";

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  AttendanceWithAvailabilities,
  DateOption,
  Group,
} from "@/types/wrapper";
import { cache } from "react";

// グループの基本情報を取得
export const getGroup = cache(async (groupId: string): Promise<Group> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();
  if (!data) {
    notFound();
  }
  return data;
});

// グループの日程候補を取得
export const getDateOptionsForGroup = cache(
  async (groupId: string): Promise<DateOption[]> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("date_options")
      .select("*")
      .eq("group_id", groupId)
      .order("sort_order", { ascending: true });

    if (!data) {
      notFound();
    }
    return data;
  }
);

// グループの回答・出席情報を取得
export const getAttendancesWithAvailabilitiesForGroup = cache(
  async (groupId: string): Promise<AttendanceWithAvailabilities[]> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("attendances")
      .select(
        `
      *,
      attendance_availabilities(*)
    `
      )
      // 作成日時(created_at)で昇順に並べる
      .order("created_at", { ascending: true })
      .eq("group_id", groupId);
    if (!data) {
      notFound();
    }
    return data;
  }
);
