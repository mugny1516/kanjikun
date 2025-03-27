import { useEffect } from "react";
import { Group } from "@/types/wrapper";
import { saveGroupToLocalStorage } from "@/lib/localStorage";

export const useSaveGroupToLocalStorage = (group: Group) => {
  useEffect(() => {
    saveGroupToLocalStorage(group);
  }, [group]);
};
