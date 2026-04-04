import { clsx } from "clsx";

type BadgeVariant = "default" | "green" | "yellow" | "blue" | "red" | "gray";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  green: "bg-primary-100 text-primary-700",
  yellow: "bg-accent-100 text-accent-700",
  blue: "bg-navy-100 text-navy-700",
  red: "bg-red-100 text-red-700",
  gray: "bg-gray-100 text-gray-500",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ variant = "default", children, className, dot }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            "w-1.5 h-1.5 rounded-full",
            variant === "green" && "bg-primary-500",
            variant === "yellow" && "bg-accent-500",
            variant === "blue" && "bg-blue-500",
            variant === "red" && "bg-red-500",
            (variant === "default" || variant === "gray") && "bg-gray-400"
          )}
        />
      )}
      {children}
    </span>
  );
}
