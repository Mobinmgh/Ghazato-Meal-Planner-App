import { cn } from "@/src/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "flat" | "outline";
}

export const Card = ({ className, variant = "elevated", ...props }: CardProps) => {
  const variants = {
    elevated: "bg-white shadow-sm border border-gray-100",
    flat: "bg-gray-50",
    outline: "border-2 border-gray-200 bg-white",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-5",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
