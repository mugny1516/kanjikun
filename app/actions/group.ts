"use server";

import { createClient } from "@/lib/supabase/server";
import {
  attendanceCreateFormSchema,
  GroupCreateFormData,
  AttendanceCreateFormData,
  GroupUpdateFormData,
} from "@/types/forms";
import { revalidatePath } from "next/cache";

// グループ作成
export const createGroup = async (formData: GroupCreateFormData) => {
  const supabase = await createClient();
  const group_id = crypto.randomUUID();

  try {
    // グループ作成
    const { error: groupError } = await supabase.from("groups").insert({
      id: group_id,
      name: formData.name,
      memo: formData.memo,
    });
    if (groupError) {
      throw groupError;
    }

    // 日付候補作成
    for (let i = 0; i < formData.dateOptions.length; i++) {
      const option = formData.dateOptions[i];
      const { error: dateError } = await supabase.from("date_options").insert({
        id: crypto.randomUUID(),
        group_id: group_id,
        when: option.when,
        sort_order: i,
      });
      if (dateError) {
        throw dateError;
      }
    }
    return { group_id };
  } catch {
    // ロールアップ処理
    await supabase.from("groups").delete().eq("id", group_id);
    throw new Error("グループ作成に失敗しました");
  }
};

export const updateGroup = async (formData: GroupUpdateFormData) => {
  const supabase = await createClient();
  const { group_id, name, memo, dateOptions } = formData;

  // グループ更新
  const { error: groupError } = await supabase
    .from("groups")
    .update({ name, memo })
    .eq("id", group_id);
  if (groupError) {
    throw new Error(groupError.message);
  }

  // 日付候補取得
  const { data: existingOptions, error: selectError } = await supabase
    .from("date_options")
    .select("id, when, sort_order")
    .eq("group_id", group_id);
  if (selectError) {
    throw new Error(selectError.message);
  }

  // 日付候補削除
  const newDateOptionIds = dateOptions.map((option) => option.id);
  const toDeleteDateOptionIds = (existingOptions || []).filter(
    (opt) => !newDateOptionIds.includes(opt.id)
  );
  if (toDeleteDateOptionIds.length > 0) {
    for (const opt of toDeleteDateOptionIds) {
      const { error: deleteOptionError } = await supabase
        .from("date_options")
        .delete()
        .eq("id", opt.id);
      if (deleteOptionError) {
        throw new Error(deleteOptionError.message);
      }
    }
  }

  // 日付候補更新
  // 日付候補作成
  for (let i = 0; i < dateOptions.length; i++) {
    const option = dateOptions[i];
    const order = i;
    const exists = (existingOptions || []).find((opt) => opt.id === option.id);
    if (exists) {
      if (exists.when !== option.when || exists.sort_order !== order) {
        const { error: updateError } = await supabase
          .from("date_options")
          .update({ when: option.when, sort_order: order })
          .eq("id", option.id ?? "");
        if (updateError) {
          throw new Error(updateError.message);
        }
      }
    } else {
      const { error: insertError } = await supabase
        .from("date_options")
        .insert({
          id: option.id ?? "",
          group_id: group_id,
          when: option.when,
          sort_order: order,
        });
      if (insertError) {
        throw new Error(insertError.message);
      }
    }
  }
  revalidatePath(`/group/${group_id}`);
  return { group_id };
};

// 最終日程を確定
export const updateGroupFinalDate = async (
  groupId: string,
  finalDate: string
) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("groups")
    .update({ final_date: finalDate })
    .eq("id", groupId);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath(`/group/${groupId}`);
  return { groupId, final_date: finalDate };
};

// 最終日程の確定をキャンセル
export const cancelGroupFinalDate = async (groupId: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("groups")
    .update({ final_date: null })
    .eq("id", groupId);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath(`/group/${groupId}`);
  return { groupId, final_date: null };
};

// 回答の作成
export const createAttendance = async (formData: AttendanceCreateFormData) => {
  const parsedData = attendanceCreateFormSchema.parse(formData);
  const supabase = await createClient();

  // 回答の作成
  const { data: attendance, error } = await supabase
    .from("attendances")
    .insert({
      id: crypto.randomUUID(),
      group_id: parsedData.group_id,
      answered_id: crypto.randomUUID(),
      answered_name: parsedData.answered_name,
      memo: parsedData.memo || null,
    })
    .select()
    .single();
  if (error) {
    throw new Error(error.message);
  }

  // 出欠席情報の作成
  const availabilities = parsedData.availability.map((av) => ({
    id: crypto.randomUUID(),
    attendance_id: attendance.id,
    date_option_id: av.date_option_id,
    availability: av.availability,
  }));
  const { error: availabilityError } = await supabase
    .from("attendance_availabilities")
    .insert(availabilities);

  if (availabilityError) {
    // ロールアップ処理
    await supabase.from("attendances").delete().eq("id", attendance.id);
    throw new Error("出欠回答の登録に失敗しました");
  }
  revalidatePath(`/group/${formData.group_id}`);
  return attendance;
};

// 回答の更新
export const updateAttendance = async (
  attendanceId: string,
  formData: AttendanceCreateFormData
) => {
  const supabase = await createClient();

  // 回答の更新
  const { error: attendanceError } = await supabase
    .from("attendances")
    .update({
      answered_name: formData.answered_name,
      memo: formData.memo || null,
    })
    .eq("id", attendanceId);
  if (attendanceError) {
    throw new Error(attendanceError.message);
  }

  // 出欠席情報の取得
  const { data: existingAvailabilities, error: selectError } = await supabase
    .from("attendance_availabilities")
    .select("id, date_option_id, availability")
    .eq("attendance_id", attendanceId);
  if (selectError) {
    throw new Error(selectError.message);
  }

  // 出欠席情報の更新
  // 出欠席情報の作成
  for (const av of formData.availability) {
    const exists = existingAvailabilities.find(
      (e) => e.date_option_id === av.date_option_id
    );
    if (exists) {
      const { error: updateError } = await supabase
        .from("attendance_availabilities")
        .update({ availability: av.availability })
        .eq("id", exists.id);
      if (updateError) {
        throw new Error(updateError.message);
      }
    } else {
      const { error: insertError } = await supabase
        .from("attendance_availabilities")
        .insert({
          id: crypto.randomUUID(),
          attendance_id: attendanceId,
          date_option_id: av.date_option_id,
          availability: av.availability,
        });
      if (insertError) {
        throw new Error(insertError.message);
      }
    }
  }

  revalidatePath(`/group/${formData.group_id}`);
  return { attendanceId };
};

// 回答の削除
export const deleteAttendance = async (
  attendanceId: string,
  groupId: string
) => {
  const supabase = await createClient();

  // 回答の削除
  const { error: attendanceError } = await supabase
    .from("attendances")
    .delete()
    .eq("id", attendanceId);
  if (attendanceError) {
    {
      throw new Error(attendanceError.message);
    }
  }
  revalidatePath(`/group/${groupId}`);
  return { attendanceId };
};

// グループ削除
export const deleteGroup = async (groupId: string) => {
  const supabase = await createClient();
  const { error: groupError } = await supabase
    .from("groups")
    .delete()
    .eq("id", groupId);
  if (groupError) {
    throw new Error(groupError.message);
  }
  revalidatePath(`/group/${groupId}`);
  return { groupId };
};
