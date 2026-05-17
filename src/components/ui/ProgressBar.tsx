import { cn } from "@/src/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
}

export const ProgressBar = ({ value, max = 100, className, color = "bg-primary-500" }: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("h-2.5 w-full bg-gray-200 rounded-full overflow-hidden", className)}>
      <div
        className={cn("h-full transition-all duration-500 rounded-full", color)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
