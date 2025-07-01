import BoardStatus from "@/components/board-status";
import SystemLogs from "@/components/system-logs";

export default function StatusPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <BoardStatus />
        <SystemLogs />
      </div>
    </div>
  );
}
