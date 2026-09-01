import { Badge } from '@/app/ui/badge';

type FeedbackMarqueeQuoteChipProps = Readonly<{
  quote: string;
}>;

export function FeedbackMarqueeQuoteChip({ quote }: FeedbackMarqueeQuoteChipProps) {
  return (
    <Badge
      variant="outline"
      className="h-auto max-w-[min(22rem,85vw)] min-w-0 justify-start whitespace-normal px-4 py-2 text-left text-sm/snug"
    >
      {quote}
    </Badge>
  );
}
