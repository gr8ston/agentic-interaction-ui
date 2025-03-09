
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConversationDetailsFooterProps {
  messageCount: number;
  onClose: () => void;
}

export function ConversationDetailsFooter({
  messageCount,
  onClose
}: ConversationDetailsFooterProps) {
  return (
    <DialogFooter>
      <div className="w-full flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {messageCount} messages
        </div>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </DialogFooter>
  );
}
