import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-card text-muted-foreground border-border",
      className
    )}>
      {Icon && <Icon className="h-12 w-12 mb-4 opacity-20" />}
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4 text-center max-w-sm">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
