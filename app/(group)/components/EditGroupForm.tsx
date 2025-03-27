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
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react"; // ゴミ箱アイコンをインポート

import { updateGroup, deleteGroup } from "@/app/actions/group";
import { GroupUpdateFormData, groupUpdateFormSchema } from "@/types/forms";
import { formatJapaneseDate } from "@/lib/date";
import { GroupWithDetails } from "@/types/wrapper";
import { deleteGroupFromLocalStorage } from "@/lib/localStorage";

export default function EditGroupForm({ group }: { group: GroupWithDetails }) {
  const router = useRouter();
  const [dateOptions, setDateOptions] = useState<
    Array<{ id: string; when: string }>
  >(group.date_options || []);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<GroupUpdateFormData>({
    resolver: zodResolver(groupUpdateFormSchema),
    defaultValues: {
      group_id: group.id,
      name: group.name,
      memo: group.memo || "",
      dateOptions: group.date_options || [],
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    form.setValue("dateOptions", dateOptions);
  }, [dateOptions, form]);

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

  const onSubmit = async (formData: GroupUpdateFormData) => {
    try {
      await updateGroup({ ...formData });
      toast.success("グループ情報を更新しました");
      router.push(`/group/${group.id}`);
    } catch {
      toast.error("グループ更新に失敗しました");
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup(group.id);
      deleteGroupFromLocalStorage(group.id);
      toast.success("グループを削除しました");
      setIsDialogOpen(false); // ダイアログを閉じる
      router.push(`/delete`);
    } catch {
      toast.error("グループ削除に失敗しました");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">STEP1 日程候補</h2>
            <p className="text-sm text-gray-600">
              カレンダーから日付を選択すると、日程候補に追加されます。
            </p>
            {form.formState.errors.dateOptions && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.dateOptions.message}
              </p>
            )}
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              minDate={new Date()}
              className="react-calendar mx-auto rounded-lg p-4"
            />

            <DndContext
              id="dnd-context-static-id"
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

          <div className="space-y-4">
            <h2 className="text-xl font-bold">STEP2 イベント名</h2>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>イベント名</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="例: たくみの送別会！" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              STEP3 メンバーのみんなに一言！ (任意)
            </h2>
            <FormField
              control={form.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="例: 楽しもう"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full mb-2">
            更新する
          </Button>
          <Button
            type="button"
            onClick={() => router.push(`/group/${group.id}`)}
            className="w-full"
            variant="outline"
          >
            戻る
          </Button>

          <div className="space-y-4 my-6">
            <h2 className="text-xl font-bold">イベントを削除する</h2>
            <p className="text-sm text-gray-600">
              ※一度削除すると復旧はできません。ご注意ください
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  イベントを削除する
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>本当に削除してよろしいですか？</DialogTitle>
                  <DialogDescription>
                    一度イベントを削除すると、そのイベントを復旧させることはできません。
                    <br />
                    本当にこのイベントを削除する場合は、『イベントを削除する』ボタンを押して下さい。
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    キャンセル
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteGroup}>
                    イベントを削除する
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </Form>
    </div>
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
    useSortable({ id: option.id });

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
        className="flex-1"
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
