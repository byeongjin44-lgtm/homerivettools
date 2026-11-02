const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

type AdSlotProps = {
  id: string;
  className?: string;
};

/**
 * Placeholder for a future Google AdSense slot. Renders nothing unless
 * NEXT_PUBLIC_ADS_ENABLED=true, and even then only reserves layout space —
 * no ad network script is loaded yet.
 */
export function AdSlot({ id, className = "" }: AdSlotProps) {
  if (!ADS_ENABLED) return null;

  return (
    <div
      id={id}
      data-ad-slot={id}
      className={`flex min-h-24 w-full items-center justify-center rounded-md border border-dashed border-zinc-300 text-xs text-zinc-400 dark:border-zinc-700 ${className}`}
    >
      Ad placeholder
    </div>
  );
}
