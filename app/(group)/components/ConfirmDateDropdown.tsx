import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateOption } from "@/types/wrapper";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ConfirmDateDropdownProps {
  finalDate?: string | null;
  dateOptions: DateOption[];
  onConfirmDate: (option: DateOption) => void;
  onCancelFinalDate: () => void;
}

export default function ConfirmDateDropdown({
  finalDate,
  dateOptions,
  onConfirmDate,
  onCancelFinalDate,
}: ConfirmDateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant={finalDate ? "destructive" : "outline"}>
          {finalDate ? "日程確定を取り消す" : "日程を確定（幹事用）"}
          {isOpen ? (
            <ChevronUp className="w-4 h-4 ml-2" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-2" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {finalDate ? (
          <DropdownMenuItem onClick={onCancelFinalDate}>
            確定日程取り消し（{finalDate}）
          </DropdownMenuItem>
        ) : (
          dateOptions.map((option) => (
            <DropdownMenuItem
              key={option.id}
              onClick={() => onConfirmDate(option)}
            >
              {option.when}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
