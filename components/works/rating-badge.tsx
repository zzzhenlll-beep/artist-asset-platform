import { cn } from "@/lib/utils";



interface RatingBadgeProps {

  score: number;

  compact?: boolean;

  className?: string;

}



export function RatingBadge({ score, compact, className }: RatingBadgeProps) {

  return (

    <div

      className={cn(

        "inline-flex items-center gap-1.5 border border-border bg-paper-elevated font-medium text-ink",

        compact ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",

        className,

      )}

    >

      <span className="text-muted-light">·</span>

      <span>{score.toFixed(1)}</span>

      {!compact && <span className="text-muted">评级</span>}

    </div>

  );

}


