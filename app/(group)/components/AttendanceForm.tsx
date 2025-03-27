"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createAttendance,
  deleteAttendance,
  updateAttendance,
} from "@/app/actions/group";
import {
  attendanceCreateFormSchema,
  AttendanceCreateFormData,
} from "@/types/forms";
import { AttendanceWithAvailabilities, DateOption } from "@/types/wrapper";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { Circle, Triangle, X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AttendanceFormProps = {
  dateOptions: DateOption[];
  groupId: string;
  attendance?: AttendanceWithAvailabilities;
  onClose: () => void;
  isUpdateMode: boolean;
};

export default function AttendanceForm({
  dateOptions,
  groupId,
  attendance,
  onClose,
  isUpdateMode,
}: AttendanceFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const defaultValues = useMemo<AttendanceCreateFormData>(() => {
    return {
      group_id: groupId,
      answered_name: attendance?.answered_name || "",
      availability: dateOptions.map((option) => {
        const existingAvailability =
          attendance?.attendance_availabilities?.find(
            (av) => av.date_option_id === option.id
          );
        return {
          date_option_id: option.id,
          availability: existingAvailability
            ? (existingAvailability.availability as
                | null
                | "available"
                | "maybe"
                | "unavailable")
            : null,
        };
      }),
      memo: attendance?.memo || "",
    };
  }, [groupId, attendance, dateOptions]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AttendanceCreateFormData>({
    resolver: zodResolver(attendanceCreateFormSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [attendance, defaultValues, reset]);

  const onSubmit: SubmitHandler<AttendanceCreateFormData> = async (
    formData
  ) => {
    try {
      if (isUpdateMode) {
        await updateAttendance(attendance!.id, formData);
        toast.success("出欠情報を更新しました");
      } else {
        await createAttendance(formData);
        toast.success("出欠情報を登録しました");
      }
      onClose();
    } catch {
      toast.error("出欠登録に失敗しました");
    }
  };

  const handleDelete = async () => {
    try {
      const boundDeleteAttendance = deleteAttendance.bind(
        null,
        attendance!.id,
        groupId
      );
      await boundDeleteAttendance();
      toast.success("出欠情報を削除しました");
      onClose();
    } catch {
      toast.error("削除に失敗しました");
    } finally {
      setIsDialogOpen(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-white rounded-xl shadow-lg border border-[#e5eeff] md:mx-20"
    >
      <div className="text-xl font-bold text-[#2C3E50] border-b pb-4 mb-6">
        {isUpdateMode ? "出欠情報の編集" : "出欠の新規回答"}
      </div>

      <div>
        <label className="block mb-2 font-medium text-[#5a7a99]">名前</label>
        <Input
          {...register("answered_name")}
          className="w-full p-2 border-[#e5eeff] rounded-lg focus:border-[#5a7a99] focus:ring-[#5a7a99]"
          placeholder="お名前を入力してください"
        />
        {errors.answered_name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.answered_name.message}
          </p>
        )}
        <p
          className={`text-sm mt-1 text-end ${
            watch("answered_name").length >= 7
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          （{watch("answered_name").length}/6）
        </p>
      </div>

      {dateOptions.map((option, index) => (
        <div key={option.id} className="space-y-4">
          <h3 className="font-semibold text-[#5a7a99]">{option.when}</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                status: "available",
                icon: <Circle size={20} />,
                label: "参加可能",
              },
              {
                status: "maybe",
                icon: <Triangle size={20} />,
                label: "未定",
              },
              {
                status: "unavailable",
                icon: <X size={20} />,
                label: "不可",
              },
            ].map(({ status, icon, label }) => (
              <label
                key={status}
                className={`
                  flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 cursor-pointer
                  transition-all hover:border-[#3b5b7d]
                  ${
                    watch(`availability.${index}.availability`) === status
                      ? "border-[#3b5b7d] bg-[#dfefff] shadow-md"
                      : "border-[#e5eeff] bg-white"
                  }
                `}
              >
                <input
                  type="radio"
                  {...register(`availability.${index}.availability` as const)}
                  value={status}
                  className="hidden"
                />
                <span className="text-[#3b5b7d]">{icon}</span>
                <span className="text-sm text-[#3b5b7d] font-medium">
                  {label}
                </span>
              </label>
            ))}
          </div>
          {errors.availability?.[index] && (
            <p className="text-red-500 text-sm">
              {errors.availability[index]?.availability?.message}
            </p>
          )}
        </div>
      ))}

      <div>
        <label className="block mb-2 font-medium text-[#5a7a99]">
          コメント（任意）
        </label>
        <Input
          {...register("memo")}
          className="w-full p-2 border-[#e5eeff] rounded-lg focus:border-[#5a7a99] focus:ring-[#5a7a99]"
          placeholder="幹事に一言メッセージを入力してください"
        />
        {errors.memo && (
          <p className="text-red-500 text-sm mt-1">{errors.memo.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        {isUpdateMode && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="destructive" className="mr-auto">
                <Trash2 className="w-4 h-4 mr-2" />
                削除
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>本当に削除しますか？</DialogTitle>
                <DialogDescription>
                  この出欠情報を削除すると、元に戻すことはできません。
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  キャンセル
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  削除する
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
          className="text-[#5a7a99] border-[#e5eeff] hover:bg-[#f5f9ff]"
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          className="bg-[#5a7a99] hover:bg-[#47647d] text-white"
        >
          {isUpdateMode ? "更新する" : "回答を送信"}
        </Button>
      </div>
    </form>
  );
}
