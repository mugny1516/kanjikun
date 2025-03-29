"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Calendar from "react-calendar";
import type { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { createGroup } from "@/app/actions/group";
import { GroupCreateFormData, groupCreateFormSchema } from "@/types/forms";
import { toast } from "sonner";
import { formatJapaneseDate } from "@/lib/date";
import { Trash2 } from "lucide-react";
import LocalStorageGroupList from "@/app/components/LocalStorageGroupList";
import { Textarea } from "@/components/ui/textarea";

export default function NewGroupPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateOptions, setDateOptions] = useState<
    Array<{ id: string; when: string }>
  >([]);

  const form = useForm<GroupCreateFormData>({
    resolver: zodResolver(groupCreateFormSchema),
    defaultValues: {
      name: "",
      memo: "",
      dateOptions: [],
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // フォームの dateOptions と内部状態の dateOptions を同期
  useEffect(() => {
    form.setValue("dateOptions", dateOptions);
  }, [dateOptions, form]);

  // カレンダーで日付選択時に、固定時刻（例：19:00）と組み合わせて日程候補を追加
  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (!value) return;
    const date = Array.isArray(value) ? value[0] : value;
    setSelectedDate(date);
    if (!date) return;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const dateStr = `${year}-${month}-${day}`;
    const timeStr = "19:00";
    const newOption = {
      id: crypto.randomUUID(),
      when: formatJapaneseDate(`${dateStr} ${timeStr}`),
    };

    setDateOptions((prev) => [...prev, newOption]);
  };

  // 並び替え用の処理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = dateOptions.findIndex((o) => o.id === active.id);
      const newIndex = dateOptions.findIndex((o) => o.id === over?.id);
      const newOrder = arrayMove(dateOptions, oldIndex, newIndex);
      setDateOptions(newOrder);
    }
  };

  const handleRemoveOption = (id: string) => {
    setDateOptions((prev) => prev.filter((o) => o.id !== id));
  };

  const handleUpdateOption = (id: string, when: string) => {
    setDateOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, when } : o))
    );
  };

  const onSubmit = async (formData: GroupCreateFormData) => {
    try {
      const { group_id: groupId } = await createGroup(formData);
      router.push(`/group/${groupId}/share`);
    } catch {
      toast.error("グループ作成に失敗しました");
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* STEP1: 日程候補 */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold">STEP1 日程候補</h2>
              <p className="text-xs text-gray-600">
                カレンダーから日付を選択すると、日程候補に追加されます。
              </p>
              {form.formState.errors.dateOptions && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.dateOptions.message}
                </p>
              )}
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                minDate={new Date()}
                className="react-calendar mx-auto "
              />

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={dateOptions.map((o) => o.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {dateOptions.map((option) => (
                      <SortableListItem
                        key={option.id}
                        option={option}
                        onRemove={() => handleRemoveOption(option.id)}
                        onUpdate={(when) => handleUpdateOption(option.id, when)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* STEP2: イベント名 */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold">STEP2 イベント名</h2>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">イベント名</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="例: たくみの送別会！" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* STEP3: メモ */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold">STEP3 一言コメント (任意)</h2>
              <FormField
                control={form.control}
                name="memo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea {...field} placeholder="例: 楽しもう" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full mb-2">
              出欠表を作成
            </Button>
            <Button
              type="button"
              onClick={() => router.push(`/`)}
              className="w-full"
              variant="outline"
            >
              戻る
            </Button>
          </form>
        </Form>
      </div>
      <div className="mt-40 p-4">
        <LocalStorageGroupList />
      </div>
    </>
  );
}

type SortableListItemProps = {
  option: {
    id: string;
    when: string;
  };
  onRemove: () => void;
  onUpdate: (when: string) => void;
};

const SortableListItem = ({
  option,
  onRemove,
  onUpdate,
}: SortableListItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: option.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 bg-white border rounded-md"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="p-2 hover:bg-gray-100 rounded-md cursor-grab"
      >
        ⠿
      </button>
      <Input
        value={option.when}
        onChange={(e) => onUpdate(e.target.value)}
        className="flex-1 text-sm"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="text-red-500 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
