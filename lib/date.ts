export const formatJapaneseDate = (dateString: string) => {
  const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
  const [datePart, timePart] = dateString.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart ? timePart.split(":").map(Number) : [0, 0];
  const date = new Date(year, month - 1, day);
  const dayOfWeek = daysOfWeek[date.getDay()];
  return `${year}/${month}/${day}(${dayOfWeek}) ${hours}:${minutes
    .toString()
    .padStart(2, "0")}〜`;
};
