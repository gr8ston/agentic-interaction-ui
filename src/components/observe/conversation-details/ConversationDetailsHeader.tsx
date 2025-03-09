
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ConversationDetailsHeaderProps {
  conversationId: string;
  appName: string;
  startTime: string;
  onClose: () => void;
}

export function ConversationDetailsHeader({
  conversationId,
  appName,
  startTime,
  onClose
}: ConversationDetailsHeaderProps) {
  return (
    <DialogHeader className="flex flex-row items-center justify-between">
      <div>
        <DialogTitle className="text-xl flex items-center gap-2">
          Conversation Details
          <span className="text-sm font-normal text-gray-500">({conversationId})</span>
        </DialogTitle>
        <DialogDescription className="mt-1">
          <div className="flex flex-col space-y-1">
            <span>Application: {appName}</span>
            <span>Started: {startTime}</span>
          </div>
        </DialogDescription>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </DialogHeader>
  );
}
