import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { AlertCircle } from "lucide-react";

interface WithdrawnApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawnApplicationDialog({
  open,
  onOpenChange,
}: WithdrawnApplicationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center w-10 h-10 bg-orange-100 rounded-full dark:bg-orange-900/30">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Application Withdrawn
            </DialogTitle>
          </div>
        </DialogHeader>
        <DialogDescription className="text-gray-600 dark:text-slate-400 leading-relaxed">
          You previously withdrew your application for this job. Unfortunately,
          you cannot apply to the same job again once an application has been
          withdrawn.
        </DialogDescription>
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white transition-all duration-300"
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
