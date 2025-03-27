import { z } from "zod";

export const groupCreateFormSchema = z.object({
  name: z.string().min(1, "イベント名は必須です"),
  memo: z.string().optional(),
  dateOptions: z
    .array(
      z.object({
        id: z.string().optional(),
        group_id: z.string().optional(),
        when: z.string(),
      })
    )
    .min(1, "少なくとも1つの日程候補を追加してください"),
});

export type GroupCreateFormData = z.infer<typeof groupCreateFormSchema>;

export const groupUpdateFormSchema = z.object({
  group_id: z.string().min(1),
  name: z.string().min(1, "イベント名は必須です"),
  memo: z.string().optional(),
  dateOptions: z
    .array(
      z.object({
        id: z.string().optional(),
        group_id: z.string().optional(),
        when: z.string(),
      })
    )
    .min(1, "少なくとも1つの日程候補を追加してください"),
});

export type GroupUpdateFormData = z.infer<typeof groupUpdateFormSchema>;

export const attendanceCreateFormSchema = z.object({
  group_id: z.string().min(1),
  answered_name: z
    .string()
    .min(1, "名前は必須です")
    .max(6, "名前は6文字以内で入力してください"),
  availability: z
    .array(
      z.object({
        date_option_id: z.string(),
        availability: z.enum(["available", "maybe", "unavailable"]).nullable(),
      })
    )
    .min(1, "少なくとも1つの日程候補に回答してください"),
  memo: z.string().optional(),
});

export type AttendanceCreateFormData = z.infer<
  typeof attendanceCreateFormSchema
>;
