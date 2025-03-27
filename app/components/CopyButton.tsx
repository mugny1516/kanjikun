"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";

type CopyButtonProps = {
  textToCopy: string;
};

export function CopyButton({ textToCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    toast.success("クリップボードにコピーしました");
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
  };

  return (
    <Button onClick={handleCopy} className="rounded-sm rounded-l-none">
      {copied ? (
        <>
          <CheckIcon className="h-4 w-4" />
          コピー
        </>
      ) : (
        <>
          <CopyIcon className="h-4 w-4" />
          コピー
        </>
      )}
    </Button>
  );
}
