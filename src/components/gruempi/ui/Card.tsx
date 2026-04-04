import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
  hover?: boolean;
}

export function Card({ children, className, accent, hover }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-xl border border-gray-200 shadow-sm",
        accent && "border-l-4 border-l-primary-500",
        hover && "transition-shadow hover:shadow-md cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={clsx("flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-100", className)}>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
  noPad?: boolean;
}

export function CardBody({ children, className, noPad }: CardBodyProps) {
  return (
    <div className={clsx(!noPad && "px-5 py-4", className)}>
      {children}
    </div>
  );
}
