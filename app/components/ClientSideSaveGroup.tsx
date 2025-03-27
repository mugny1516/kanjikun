"use client";

import { Group } from "@/types/wrapper";
import { useSaveGroupToLocalStorage } from "@/hooks/useSaveGroupToLocalStorage";

export default function ClientSideSaveGroup({ group }: { group: Group }) {
  useSaveGroupToLocalStorage(group);

  return null;
}
