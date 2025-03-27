"use client";

import { useState, useRef, useEffect } from "react";
import AttendanceForm from "./AttendanceForm";
import AttendanceTable from "./AttendanceTable";
import { AttendanceWithAvailabilities, DateOption } from "@/types/wrapper";
import { Button } from "@/components/ui/button";
import {
  updateGroupFinalDate,
  cancelGroupFinalDate,
} from "@/app/actions/group";
import { toast } from "sonner";
import ConfirmDateDropdown from "./ConfirmDateDropdown";

type AttendanceFormWrapperProps = {
  groupId: string;
  dateOptions: DateOption[];
  attendances: AttendanceWithAvailabilities[];
  finalDate?: string | null;
};

const calculateDatePoints = (
  dateOptions: DateOption[],
  attendances: AttendanceWithAvailabilities[]
) => {
  return dateOptions.map((option) => ({
    ...option,
    points: attendances.reduce((sum, attendance) => {
      const availability = attendance.attendance_availabilities.find(
        (av) => av.date_option_id === option.id
      );
      return (
        sum +
        (availability?.availability === "available"
          ? 2
          : availability?.availability === "maybe"
          ? 1
          : 0)
      );
    }, 0),
  }));
};

const getTopTwoPoints = (
  dateOptionsWithPoints: (DateOption & { points: number })[]
) => {
  return Array.from(
    new Set(
      [...dateOptionsWithPoints]
        .sort((a, b) => b.points - a.points)
        .map((d) => d.points)
    )
  ).slice(0, 2);
};

export default function AttendanceFormWrapper({
  dateOptions,
  groupId,
  attendances,
  finalDate,
}: AttendanceFormWrapperProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<
    string | null
  >(null);
  const formRef = useRef<HTMLDivElement>(null);

  const dateOptionsWithPoints = calculateDatePoints(dateOptions, attendances);
  const topTwoPoints = getTopTwoPoints(dateOptionsWithPoints);

  const handleButtonClick = () => {
    setSelectedAttendanceId(null);
    setIsFormVisible(true);
  };

  const handleNameClick = (attendanceId: string) => {
    setSelectedAttendanceId(attendanceId);
    setIsFormVisible(true);
  };

  useEffect(() => {
    if (isFormVisible && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollBy({ top: 600, behavior: "smooth" });
    }
  }, [isFormVisible, selectedAttendanceId]);

  const selectedAttendance = attendances.find(
    (att) => att.id === selectedAttendanceId
  );

  // 日程候補から最終日程を確定する処理
  const handleConfirmDate = async (option: DateOption) => {
    try {
      await updateGroupFinalDate(groupId, option.when);
      toast.success(`最終日程を「${option.when}」に確定しました`);
    } catch {
      toast.error("日程確定に失敗しました");
    }
  };

  // 確定済み日程を取り消す処理
  const handleCancelFinalDate = async () => {
    try {
      await cancelGroupFinalDate(groupId);
      toast.success("確定日程を取り消しました");
    } catch {
      toast.error("取り消しに失敗しました");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold tracking-tight">回答状況</h3>
        {/* 「日程を確定」ボタン（ドロップダウン） */}
        <ConfirmDateDropdown
          finalDate={finalDate}
          dateOptions={dateOptions}
          onConfirmDate={handleConfirmDate}
          onCancelFinalDate={handleCancelFinalDate}
        />
      </div>

      <AttendanceTable
        attendances={attendances}
        dateOptionsWithPoints={dateOptionsWithPoints}
        topTwoPoints={topTwoPoints}
        onNameClick={handleNameClick}
        finalDate={finalDate}
      />
      <div className="text-sm text-gray-600 mb-2">
        ※各自の出欠状況を変更するには名前のリンクをクリックしてください。
      </div>

      <div className="flex justify-center items-center my-6">
        <Button
          onClick={handleButtonClick}
          className="w-34 h-34 aspect-square rounded-full text-white text-xl"
          disabled={isFormVisible}
        >
          出欠を回答
        </Button>
      </div>

      {isFormVisible && (
        <div ref={formRef}>
          <AttendanceForm
            dateOptions={dateOptions}
            groupId={groupId}
            attendance={selectedAttendance}
            onClose={() => setIsFormVisible(false)}
            isUpdateMode={!!selectedAttendance}
          />
        </div>
      )}
    </div>
  );
}
