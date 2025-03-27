import { Group } from "@/types/wrapper";

export const saveGroupToLocalStorage = (group: Group) => {
  if (typeof window === "undefined") return;

  const savedGroups = JSON.parse(
    localStorage.getItem("savedGroups") || "[]"
  ) as Group[];

  const existingIndex = savedGroups.findIndex((g) => g.id === group.id);

  if (existingIndex === -1) {
    // 新規追加
    localStorage.setItem(
      "savedGroups",
      JSON.stringify([...savedGroups, group])
    );
  } else {
    // 既存データの更新（変更がある場合のみ）
    const existingGroup = savedGroups[existingIndex];
    if (JSON.stringify(existingGroup) !== JSON.stringify(group)) {
      const updatedGroups = [...savedGroups];
      updatedGroups[existingIndex] = group;
      localStorage.setItem("savedGroups", JSON.stringify(updatedGroups));
    }
  }
};

export const deleteGroupFromLocalStorage = (groupId: string) => {
  if (typeof window === "undefined") return;

  const savedGroups = JSON.parse(
    localStorage.getItem("savedGroups") || "[]"
  ) as Group[];

  const updatedGroups = savedGroups.filter((g) => g.id !== groupId);
  localStorage.setItem("savedGroups", JSON.stringify(updatedGroups));
};
