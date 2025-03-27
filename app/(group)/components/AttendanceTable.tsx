"use client";

import React from "react";
import { Attendance, DateOption } from "@/types/wrapper";
import { Circle, Triangle, X, User } from "lucide-react";

type AttendanceTableProps = {
  attendances: Attendance[];
  dateOptionsWithPoints: (DateOption & { points: number })[];
  topTwoPoints: number[];
  onNameClick: (attendanceId: string) => void;
  finalDate?: string | null; // 追加：確定日時がある場合はその値
};

export default function AttendanceTable({
  attendances,
  dateOptionsWithPoints,
  topTwoPoints,
  onNameClick,
  finalDate,
}: AttendanceTableProps) {
  const cellClass =
    "border px-2 py-1 text-center text-xs text-[#5a7a99] font-semibold";
  const headerCellClass =
    "border px-2 py-1 text-center font-semibold bg-gray-100 min-w-24 text-xs md:text-sm";
  const iconCellClass = "border px-2 py-1 text-center font-semibold";
  const commentCellClass = "border px-2 py-1 text-center text-xs text-gray-500";
  const mobileCommentCellClass =
    "border px-2 py-1 text-center text-[#5a7a99] font-semibold min-w-24 text-xs";
  const nameCellClass =
    "border px-2 py-1 text-center text-[#5a7a99] font-bold cursor-pointer hover:bg-blue-50 hover:underline whitespace-nowrap text-xs";
  const iconCountCellClass =
    "border px-2 py-1 text-center text-xs text-[#5a7a99] font-semibold max-w-16";

  // highlightMap に、最終確定日時の場合はグラデーションクラスを優先的に設定
  const highlightMap = dateOptionsWithPoints.reduce<Record<string, string>>(
    (acc, option) => {
      if (finalDate && option.when === finalDate) {
        acc[option.id] = "bg-pink-300 ";
      } else if (topTwoPoints.includes(option.points)) {
        acc[option.id] =
          option.points === topTwoPoints[0] ? "bg-[#d1e6f9]" : "bg-[#e6f0f7]";
      }
      return acc;
    },
    {}
  );

  const iconColors = {
    available: "#5a7a99",
    maybe: "#91a8ba",
    unavailable: "#91a8ba",
  };

  const renderIcon = (availability: string | null) => {
    switch (availability) {
      case "available":
        return (
          <div className="flex justify-center">
            <Circle size={24} color={iconColors.available} />
          </div>
        );
      case "maybe":
        return (
          <div className="flex justify-center">
            <Triangle size={24} color={iconColors.maybe} />
          </div>
        );
      case "unavailable":
        return (
          <div className="flex justify-center">
            <X size={24} color={iconColors.unavailable} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-4 py-2 text-left font-semibold bg-gray-100 w-[196px]">
                日程
              </th>
              <th className={`${headerCellClass} w-[40px]`}>○</th>
              <th className={`${headerCellClass} w-[40px]`}>△</th>
              <th className={`${headerCellClass} w-[40px]`}>×</th>
              {attendances.map((attendance) => (
                <th
                  key={attendance.id}
                  className={`${headerCellClass} text-[#5a7a99] cursor-pointer max-w-[100px] truncate hover:bg-blue-50 hover:underline`}
                  onClick={() => onNameClick(attendance.id)}
                  title={attendance.answered_name}
                >
                  <div className="flex items-center justify-center gap-1">
                    {attendance.answered_name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dateOptionsWithPoints.map((option) => {
              const highlightClass = highlightMap[option.id] || "";
              return (
                <tr key={option.id} className={highlightClass}>
                  <td className="border px-4 py-2 text-left">{option.when}</td>
                  <td className={iconCountCellClass}>
                    <span className="text-lg">
                      {
                        attendances.filter((attendance) =>
                          attendance.attendance_availabilities.some(
                            (av) =>
                              av.date_option_id === option.id &&
                              av.availability === "available"
                          )
                        ).length
                      }
                      <span className="text-xs">人</span>
                    </span>
                  </td>
                  <td className={iconCountCellClass}>
                    <span className="text-lg">
                      {
                        attendances.filter((attendance) =>
                          attendance.attendance_availabilities.some(
                            (av) =>
                              av.date_option_id === option.id &&
                              av.availability === "maybe"
                          )
                        ).length
                      }
                      <span className="text-xs">人</span>
                    </span>
                  </td>
                  <td className={iconCountCellClass}>
                    <span className="text-lg">
                      {
                        attendances.filter((attendance) =>
                          attendance.attendance_availabilities.some(
                            (av) =>
                              av.date_option_id === option.id &&
                              av.availability === "unavailable"
                          )
                        ).length
                      }
                      <span className="text-xs">人</span>
                    </span>
                  </td>
                  {attendances.map((attendance) => {
                    const availability =
                      attendance.attendance_availabilities.find(
                        (av) => av.date_option_id === option.id
                      );
                    return (
                      <td
                        key={`${attendance.id}-${option.id}`}
                        className={`${iconCellClass} ${highlightClass}`}
                      >
                        {renderIcon(availability?.availability || null)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr>
              <td className="border px-4 py-2 text-left font-semibold bg-gray-100">
                コメント
              </td>
              <td className={cellClass} colSpan={3}></td>
              {attendances.map((attendance) => (
                <td key={attendance.id} className={commentCellClass}>
                  {attendance.memo || ""}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto block md:hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-2 py-1 text-center font-semibold bg-gray-100">
                <User size={16} className="inline-block text-[#5a7a99]" />
              </th>
              {dateOptionsWithPoints.map((option) => {
                const highlightClass = highlightMap[option.id] || "";
                return (
                  <th
                    key={option.id}
                    className={`${headerCellClass} ${highlightClass}`}
                  >
                    {option.when}
                  </th>
                );
              })}
              <th className={`${headerCellClass} min-w-32`}>コメント</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 text-center font-medium bg-gray-50">
                ○
              </td>
              {dateOptionsWithPoints.map((option) => {
                const highlightClass = highlightMap[option.id] || "";
                return (
                  <td
                    key={`available-${option.id}`}
                    className={`${cellClass} ${highlightClass}`}
                  >
                    <span className="text-l">
                      {
                        attendances.filter((attendance) =>
                          attendance.attendance_availabilities.some(
                            (av) =>
                              av.date_option_id === option.id &&
                              av.availability === "available"
                          )
                        ).length
                      }
                      <span className="text-xs">人</span>
                    </span>
                  </td>
                );
              })}
              <td className={mobileCommentCellClass}></td>
            </tr>
            <tr>
              <td className="border px-4 py-2 text-center font-medium bg-gray-50">
                △
              </td>
              {dateOptionsWithPoints.map((option) => {
                const highlightClass = highlightMap[option.id] || "";
                return (
                  <td
                    key={`maybe-${option.id}`}
                    className={`${cellClass} ${highlightClass}`}
                  >
                    <span className="text-l">
                      {
                        attendances.filter((attendance) =>
                          attendance.attendance_availabilities.some(
                            (av) =>
                              av.date_option_id === option.id &&
                              av.availability === "maybe"
                          )
                        ).length
                      }
                      <span className="text-xs">人</span>
                    </span>
                  </td>
                );
              })}
              <td className={mobileCommentCellClass}></td>
            </tr>
            <tr>
              <td className="border px-4 py-2 text-center font-medium bg-gray-50">
                ×
              </td>
              {dateOptionsWithPoints.map((option) => {
                const highlightClass = highlightMap[option.id] || "";
                return (
                  <td
                    key={`unavailable-${option.id}`}
                    className={`${cellClass} ${highlightClass}`}
                  >
                    <span className="text-l">
                      {
                        attendances.filter((attendance) =>
                          attendance.attendance_availabilities.some(
                            (av) =>
                              av.date_option_id === option.id &&
                              av.availability === "unavailable"
                          )
                        ).length
                      }
                      <span className="text-xs">人</span>
                    </span>
                  </td>
                );
              })}
              <td className={mobileCommentCellClass}></td>
            </tr>
            {attendances.map((attendance) => (
              <tr key={attendance.id}>
                <td
                  className={`${nameCellClass} bg-gray-50`}
                  onClick={() => onNameClick(attendance.id)}
                  title={attendance.answered_name}
                >
                  {attendance.answered_name}
                </td>
                {dateOptionsWithPoints.map((option) => {
                  const highlightClass = highlightMap[option.id] || "";
                  const availability =
                    attendance.attendance_availabilities.find(
                      (av) => av.date_option_id === option.id
                    );
                  return (
                    <td
                      key={`${attendance.id}-${option.id}`}
                      className={`${iconCellClass} ${highlightClass}`}
                    >
                      {renderIcon(availability?.availability || null)}
                    </td>
                  );
                })}
                <td className={mobileCommentCellClass}>
                  {attendance.memo || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
